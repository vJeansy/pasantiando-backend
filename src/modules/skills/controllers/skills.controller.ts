import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SkillService } from '../services/skills.service';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { UpdateSkillDto } from '../dtos/update-skill.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateSkillDto) {
    return await this.skillService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.skillService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return await this.skillService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.skillService.delete(id);
  }
}