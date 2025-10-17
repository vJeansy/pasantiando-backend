import { Controller, Post, Get, Patch, Delete, Body, Param, Header, UseGuards } from '@nestjs/common';
import { LanguageService } from '../services/language.service';
import { CreateLanguageDto } from '../dtos/create-language.tdo';
import { UpdateLanguageDto } from '../dtos/update-languagr.tdo';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Create language` })
  async create(@Body() dto: CreateLanguageDto) {
    return await this.languageService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Obtain all languages` })
  async findAll() {
    return await this.languageService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Obtain language by id` })
  async update(@Param('id') id: string, @Body() dto: UpdateLanguageDto) {
    return await this.languageService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Delete language` })
  async delete(@Param('id') id: string) {
    return await this.languageService.delete(id);
  }
}