import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLanguageDto } from '../dtos/create-language.tdo';
import { UpdateLanguageDto } from '../dtos/update-languagr.tdo';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLanguageDto) {
    return await this.prisma.languages.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.languages.findMany();
  }

  async update(id: string, dto: UpdateLanguageDto) {
    return await this.prisma.languages.update({ where: { id }, data: dto, });
}

  async delete(id: string) {
    return await this.prisma.languages.delete({ where: { id } });
  }
}