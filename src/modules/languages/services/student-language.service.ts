import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class StudentLanguageService {
  constructor(private prisma: PrismaService) { }

  async assign({ studentId, languageId, proficiencyLevel }: { studentId: string; languageId: string; proficiencyLevel?: any }) {
    const level = proficiencyLevel ?? "A1"; // ✅ valor por defecto
    return await this.prisma.student_languages.upsert({
      where: {
        student_id_language_id: {
          student_id: studentId,
          language_id: languageId,
        },
      },
      update: { proficiency_level: level, },
      create: {
        student_id: studentId,
        language_id: languageId,
        proficiency_level: level,
      },
    });
  }

  async assignFromUser(userId: string, languageId: string, proficiencyLevel?: string) {
    const student = await this.prisma.students.findUnique({ where: { id: userId } });
    if (!student) throw new BadRequestException("Perfil de estudiante no encontrado");
    return this.assign({
      studentId: student.id,
      languageId,
      proficiencyLevel,
    });
  }

  async findByStudent(studentId: string) {
    return await this.prisma.student_languages.findMany({
      where: { student_id: studentId },
      include: { languages: true },
      orderBy: { languages: { language_name: 'desc' } },
    });
  }

  async remove(studentId: string, languageId: string) {
    return await this.prisma.student_languages.delete({
      where: {
        student_id_language_id: {
          student_id: studentId,
          language_id: languageId,
        },
      },
    });
  }

  async removeFromUser(userId: string, languageId: string) {
    const student = await this.prisma.students.findUnique({
      where: { id: userId },
    });

    if (!student) throw new BadRequestException("Perfil de estudiante no encontrado");
    return await this.remove(student.id, languageId);
  }
}