import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, UnauthorizedException, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExperienceDto) {
    if (dto.start_date && dto.end_date && new Date(dto.end_date) < new Date(dto.start_date)) {
      throw new BadRequestException('La fecha de finalización no puede ser anterior a la de inicio.');
    }

    if (dto.is_current && dto.end_date) {
      throw new BadRequestException('Una experiencia actual no debe tener fecha de finalización.');
    }

    const studentExists = await this.prisma.students.findUnique({
      where: { id: dto.student_id },
    });

    if (!studentExists) throw new NotFoundException('Estudiante no encontrado.');

    const data = {
      ...dto,
      start_date: dto.start_date ? new Date(dto.start_date) : undefined,
      end_date: dto.end_date ? new Date(dto.end_date) : undefined,
    };

    try {
      return await this.prisma.student_experience.create({ data });
    } catch (err) {
      throw new InternalServerErrorException('Error al crear la experiencia.', err);
    }
  }

  async findByStudentId(studentId: string) {
    if (!studentId) throw new UnauthorizedException('No estás autorizado para ver estas experiencias.');

    try {
      return await this.prisma.student_experience.findMany({
        where: { student_id: studentId },
        include: { students: { include: { student_experience: true} } },
        orderBy: { start_date: 'desc' },
      });
    } catch (err) {
      throw new InternalServerErrorException('Error al cargar las experiencias.', err);
    }
  }

  async updateStudentExperience(studentId: string, experienceId: string, updateDto: UpdateExperienceDto) {
    const experience = await this.prisma.student_experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience || experience.student_id !== studentId) {
      throw new NotFoundException('Experiencia no encontrada para este estudiante.');
    }

    try {
      return await this.prisma.student_experience.update({
        where: { id: experienceId },
        data: {
          ...updateDto,
          start_date: updateDto.start_date ? new Date(updateDto.start_date) : undefined,
          end_date: updateDto.end_date ? new Date(updateDto.end_date) : undefined,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException('Error al actualizar la experiencia.', err);
    }
  }

  async removeStudentExperience(studentId: string, experienceId: string) {
    const experience = await this.prisma.student_experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience || experience.student_id !== studentId) {
      throw new NotFoundException('No se encontró esta experiencia para el estudiante.');
    }

    try {
      return await this.prisma.student_experience.delete({
        where: { id: experienceId },
      });
    } catch (err) {
      throw new InternalServerErrorException('Error al eliminar la experiencia.', err);
    }
  }
}