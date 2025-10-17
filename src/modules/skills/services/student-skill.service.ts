import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class StudentSkillService {
  constructor(private prisma: PrismaService) { }

  async assign({ studentId, skillId, proficiencyLevel }: { studentId: string; skillId: string; proficiencyLevel?: string }) {
    const level = proficiencyLevel ?? "basic"; // ✅ valor por defecto
    return await this.prisma.student_skills.upsert({
      where: {
        student_id_skill_id: {
          student_id: studentId,
          skill_id: skillId,
        },
      },
      update: {
        proficiency_level: level,
      },
      create: {
        student_id: studentId,
        skill_id: skillId,
        proficiency_level: level,
      },
    });
  }

  async assignFromUser(userId: string, skillId: string, proficiencyLevel?: string) {
    const student = await this.prisma.students.findUnique({
      where: { id: userId }
    });

    if (!student) throw new BadRequestException("Perfil de estudiante no encontrado");

    return this.assign({
      studentId: student.id,
      skillId,
      proficiencyLevel,
    });
  }

  async findByStudent(studentId: string) {
    return await this.prisma.student_skills.findMany({
      where: { student_id: studentId },
      include: { skills: true },
      orderBy: { skills: { name: 'asc' } }
    });
  }

  async remove(studentId: string, skillId: string) {
    return await this.prisma.student_skills.delete({
      where: {
        student_id_skill_id: {
          student_id: studentId,
          skill_id: skillId,
        },
      },
    });
  }

  async removeFromUser(userId: string, skillId: string) {
    const student = await this.prisma.students.findUnique({
      where: { id: userId },
    });

    if (!student) throw new BadRequestException("Perfil de estudiante no encontrado");

    return await this.remove(student.id, skillId);
  }
}