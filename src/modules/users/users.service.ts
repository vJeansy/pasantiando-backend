import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filet-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/common/user-type-.enum';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { EmailService } from '../email-service/email-service.service';
import { generateAccountDeactivationEmail } from '../email-service/templates/generateAccountDeactivationEmail';
import capitalize from 'src/utils/selects/capitalize';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,) { }

  async createUser(createUserDto: CreateUserDto) {
    const { email_address, hashed_password, user_type, student, business } = createUserDto;

    // 🔒 Verificar si el correo ya existe
    const existingUser = await this.prisma.users.findUnique({
      where: { email_address },
    });

    if (existingUser) {
      throw new ConflictException(`El correo ${email_address} ya está registrado.`);
    }

    // 🔑 Hashear la contraseña
    const passwordHash = await bcrypt.hash(hashed_password, 10);

    // 🧠 Validar tipo de usuario
    if (!Object.values(UserType).includes(user_type)) {
      throw new BadRequestException('Tipo de usuario inválido.');
    }

    // 🧱 Construir datos base
    const userCreationData: Prisma.usersCreateInput = {
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email_address,
      hashed_password: passwordHash,
      user_type,
    };

    // 👨‍🎓 Si es estudiante, validar y crear perfil
    if (user_type === UserType.STUDENT) {
      if (!student) {
        throw new BadRequestException('Datos del perfil estudiantil son requeridos.');
      }

      userCreationData.students = {
        create: { ...student },
      };
    }

    // 🏢 Si es empresa, validar y crear perfil
    if (user_type === UserType.BUSINESS) {
      if (!business || !business.business_name || !business.industry) {
        throw new BadRequestException('Nombre de empresa e industria son requeridos.');
      }

      userCreationData.business = {
        create: { ...business },
      };
    }

    // 🔄 Incluir relaciones según tipo
    const includeRelations =
      user_type === UserType.STUDENT
        ? { students: true }
        : { business: true };

    try {
      const newUser = await this.prisma.users.create({
        data: userCreationData,
        include: includeRelations,
      });

      // 🧼 Remover contraseña antes de retornar
      const { hashed_password, ...safeUser } = newUser;
      return safeUser;
    } catch (err) {
      throw new InternalServerErrorException('Error al crear el usuario.', err);
    }
  }

  async findAllUsers(filter: FilterUserDto) {
    const where: Prisma.usersWhereInput = {
      is_active: true,
      ...(filter.email_address && { email_address: { contains: filter.email_address } }),
    };

    if (filter.email_address) {
      where.email_address = { contains: filter.email_address };
    }

    try {
      const users = await this.prisma.users.findMany({
        where,
        include: {
          students: {
            include: {
              student_skills: { include: { skills: true } },
              student_languages: { include: { languages: true } },
              student_projects: true,
              student_education: true,
              student_experience: true,
            },
          },
        },
      });

      // 🧼 Remover contraseña antes de retornar
      return users.map(({ hashed_password, ...safeUser }) => safeUser);
    } catch (error) {
      throw new InternalServerErrorException(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        include: {
          students: {
            include: {
              student_skills: { include: { skills: true } },
              student_languages: { include: { languages: true } },
              student_projects: true,
              student_experience: true,
              student_education: true,
            },
          },
          business: true,
        },
      });

      if (!user || !user.is_active) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const { hashed_password, ...safeUser } = user;
      return safeUser;
    } catch (err) {
      throw new InternalServerErrorException(`Error al obtener usuarios: ${err.message}`)
    }
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    try {
      if (dto.user_type) throw new BadRequestException('El tipo de usuario no puede ser cambiado');

      const user = await this.prisma.users.findUnique({
        where: { id },
        include: {
          students: {
            include: {
              student_skills: { include: { skills: true } },
              student_languages: { include: { languages: true } },
              student_projects: true,
              student_experience: true,
              student_education: true,
            },
          },
          business: true,
        }
      });
      if (!user) throw new NotFoundException('El usuario no fue encontrado');

      const updateData: Prisma.usersUpdateInput = {};
      const errors: { field: string; message: string }[] = [];

      // Validación de email
      if (dto.email_address && dto.email_address !== user.email_address) {
        const emailTaken = await this.prisma.users.findUnique({ where: { email_address: dto.email_address } });
        if (emailTaken) errors.push({ field: 'email_address', message: 'Este correo ya está en uso' });
        else updateData.email_address = dto.email_address;
      }

      // Validación de contraseña actual antes de cambiarla
      if (dto.hashed_password) {
        if (!dto.current_password) {
          errors.push({ field: 'current_password', message: 'Debes ingresar tu contraseña actual' });
        } else {
          const isValid = await bcrypt.compare(dto.current_password, user.hashed_password);
          if (!isValid) {
            errors.push({ field: 'current_password', message: 'La contraseña actual es incorrecta' });
          } else {
            updateData.hashed_password = await bcrypt.hash(dto.hashed_password, 10);
          }
        }
      }

      // Campos básicos
      updateData.first_name = dto.first_name;
      updateData.last_name = dto.last_name;
      updateData.is_active = dto.is_active;
      updateData.updated_at = dto.updated_at;
      //updateData.updated_by = dto.updated_by

      // Validación y actualización de perfil estudiantil
      if (user.user_type === UserType.STUDENT && dto.student) {
        // Validaciones modulares...
        if (errors.length > 0) throw new BadRequestException({ message: 'Validación fallida', errors });

        await this.prisma.students.update({ where: { id: user.id }, data: { ...dto.student } });
      }

      // Actualización de perfil empresarial
      if (user.user_type === UserType.BUSINESS && dto.business) {
        await this.prisma.business.update({ where: { id: user.id }, data: { ...dto.business } });
      }

      const updatedUser = await this.prisma.users.update({ where: { id }, data: updateData, include: { students: true, business: true } });
      // 🧼 Remover contraseña antes de retornar
      const { hashed_password, ...safeUser } = updatedUser;
      return safeUser;
    } catch (err) {
      throw new InternalServerErrorException(`Error al actualizar datos. ${err.message}`);
    }
  }

  async softRemove(id: string) {
    try {
      const user = await this.prisma.users.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (!user.is_active) {
        throw new BadRequestException('Este usuario ya fue eliminado.');
      }

      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { is_active: false },
      });

      // Enviar correo notificando la desactivación
      const defaultSubject = `Desactivación de tu cuenta ${capitalize(user.first_name)} ${capitalize(user.last_name)}`;
      const defaultBody = `Hola ${capitalize(user.first_name)},\n\nTu cuenta ha sido desactivada. Si deseas reactivarla o tienes alguna duda, contáctanos a info@pasantiando.com.`;
      const htmlBody = generateAccountDeactivationEmail({
        firstName: user.first_name,
        lastName: user.last_name,
      });

      await this.emailService.sendEmail(
        user.email_address,
        defaultSubject,
        defaultBody,
        htmlBody
      );

      // 🧼 Remover contraseña antes de retornar
      const { hashed_password, ...safeUser } = updatedUser;
      return safeUser;
    } catch (err) {
      throw new InternalServerErrorException(`Error al eliminar la cuenta. ${err.message}`);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.users.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      /*if (user.user_type === UserType.ADMIN) {
        throw new ForbiddenException('No se puede eliminar una cuenta administrativa');
      }*/

      const deletedUser = await this.prisma.users.delete({ where: { id } });
      // 🧼 Remover contraseña antes de retornar
      const { hashed_password, ...safeUser } = deletedUser;
      return safeUser;
    } catch (err) {
      throw new InternalServerErrorException(`Error al eliminar el usuario. ${err.message}`);
    }
  }
}