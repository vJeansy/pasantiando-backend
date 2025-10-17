import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { UpdateSkillDto } from '../dtos/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSkillDto) {
    return await this.prisma.skills.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.skills.findMany();
  }

  async update(id: string, dto: UpdateSkillDto) {
    return await this.prisma.skills.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return await this.prisma.skills.delete({ where: { id } });
  }
}