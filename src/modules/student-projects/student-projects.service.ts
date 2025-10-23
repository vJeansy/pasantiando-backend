import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateStudentProjectDto } from './dto/create-student-project.dto';
import { UpdateStudentProjectDto } from './dto/update-student-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentProjectsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateStudentProjectDto) {
    const studentExists = await this.prisma.students.findUnique({ where: { id: dto.student_id } });
    if (!studentExists) throw new NotFoundException('Estudiante no encontrado.');
    const data = {
      ...dto,
    };
    try {
      return await this.prisma.student_projects.create({ data });
    } catch (err) {
      throw new InternalServerErrorException('Error al crear nuevo proyecto.', err);
    }
  }

  async findByStudentId(studentId: string) {
    if (!studentId) throw new UnauthorizedException('No estás autorizado para ver estas experiencias.');
    try {
      return await this.prisma.student_projects.findMany({
        where: { student_id: studentId },
        orderBy: { created_at: 'desc' },
      })
    } catch (err) {
      throw new InternalServerErrorException('Error al cargar los proyectos de este estudiante');
    }
  }

  findAll() {
    return `This action returns all studentProjects`;
  }

  async findOne(id: string) {
    if (!id) throw new NotFoundException('No se encontraron proyectos con este ID');
    try {
      return await this.prisma.student_projects.findUnique({ where: { id } });
    } catch (err) {
      throw new InternalServerErrorException('Error al obtener el proyecto');
    }
  }

  async updateStudentProject(projectId: string, studentId: string, updateDto: UpdateStudentProjectDto) {
    const project = await this.prisma.student_projects.findUnique({ where: { id: projectId } });
    if (!project || project.student_id !== studentId) throw new NotFoundException(' Projyecto no encontrado para este estudiante.');
    try {
      return await this.prisma.student_projects.update({
        where: { id: projectId },
        data: { ...updateDto, },
      })
    } catch (err) {
      throw new InternalServerErrorException('Error actualizar proyecto.');
    }
  }

  async update(projectId: string, updateDto: UpdateStudentProjectDto) {
    const project = await this.prisma.student_projects.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('No se encontraron proyectos con este ID.');
    try {
      return await this.prisma.student_projects.update({
        where: { id: projectId },
        data: { ...updateDto },
      });
    } catch (err) {
      throw new InternalServerErrorException('Error actualizar proyecto.');
    }
  }

  async removeMyExperience(studentId: string, projectId: string) {
    const project = await this.prisma.student_projects.findUnique({ where: { id: projectId },
    select: { id: true, student_id: true } });
    if (!project || studentId !== project.student_id) throw new NotFoundException('Projyecto no encontrado para este estudiante.')
    try {
      return await this.prisma.student_projects.delete({ where: { id: projectId } });
    } catch (err) {
      throw new InternalServerErrorException('Error al tratar de eliminar proyecto.')
    }
  }

  async remove(projectId: string) {
    const project = await this.prisma.student_projects.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException(' No se encontraron proyectos con este id.');
    try {
      return await this.prisma.student_projects.delete({ where: { id: projectId } });
    } catch (err) {
      throw new InternalServerErrorException('Error al tratar de eliminar proyecto.')
    }
  }
}
