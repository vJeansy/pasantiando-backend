// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { UserType } from 'src/common/user-type-.enum';
import { RegisterBusinessDto } from './dto/register-business.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateUser(loginDto: LoginDto): Promise<any> { //Validar usuario antes de loguear.
    const { email_address, hashed_password } = loginDto;
    const user = await this.prisma.users.findUnique({ where: { email_address, }, });
    if (!user) throw new UnauthorizedException('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
    if (!user.is_active) throw new UnauthorizedException('Tu cuenta ha sido desactivada. Si deseas reactivarla, contáctanos a info@pasantiando.com.');
    const isPasswordValid = await bcrypt.compare(hashed_password, user.hashed_password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
    return user;
  }

  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const existingEmail = await this.prisma.users.findUnique({ where: { email_address: registerStudentDto.email_address, } });
    const existingNationalId = await this.prisma.students.findUnique({ where: { national_id: registerStudentDto.national_id, } })
    if (existingEmail) throw new BadRequestException('El correo electrónico ingresado ya está en uso.');
    if (existingNationalId) throw new BadRequestException('La cedula ingresada ya está en uso');
    if (!registerStudentDto) throw new BadRequestException();
    const {
      hashed_password,
      headline,
      phone,
      national_id,
      birth_date,
      ...userData } = registerStudentDto;
    const hashedPassword = await bcrypt.hash(hashed_password, 10);

    return this.prisma.users.create({
      data: {
        ...userData,
        hashed_password: hashedPassword,
        user_type: UserType.STUDENT,
        students: {
          create: {
            headline: headline,
            phone: phone,
            birth_date: birth_date,
            national_id: national_id,
          },
        },
      },
      include: { students: true },
    })
  }

  async registerBusiness(registerBusinessDto: RegisterBusinessDto) {
    const existingEmail = await this.prisma.users.findUnique({ where: { email_address: registerBusinessDto.email_address, } });
    const existingTaxId = await this.prisma.business.findUnique({ where: { tax_id: registerBusinessDto.tax_id, } })
    if (existingEmail) throw new BadRequestException('El correo electrónico ingresado ya está en uso.');
    if (existingTaxId) throw new BadRequestException('El RNC ingresado ya está en uso.')

    const {
      hashed_password,
      business_name,
      industry,
      phone,
      street_address,
      city,
      state_province,
      postal_code,
      country,
      summary,
      tax_id,
      ...userData } = registerBusinessDto;
    const hashedPassword = await bcrypt.hash(hashed_password, 10);

    return this.prisma.users.create({
      data: {
        ...userData,
        hashed_password: hashedPassword,
        user_type: UserType.BUSINESS,
        business: {
          create: {
            business_name: business_name,
            industry: industry,
            street_address: street_address,
            city: city,
            state_province: state_province,
            postal_code: postal_code,
            country: country,
            phone: phone,
            summary: summary,
            tax_id: tax_id,
          },
        },
      },
    });
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const user = await this.validateUser(loginDto);

    const payload = {
      email_address: user.email_address,
      sub: user.id,
      user_type: user.user_type
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        user_type: user.user_type,
      },
    };
  }
}