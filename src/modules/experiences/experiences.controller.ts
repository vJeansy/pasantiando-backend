import { Controller, Get, Post, Body, Req, Patch, Param, Delete, HttpCode, UseGuards, ForbiddenException, NotFoundException, } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'New experience successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid data used.' })
  @ApiOperation({ summary: 'Create new experience from an authenticated user/student' })
  async create(@Req() req: any, @Body() createDto: CreateExperienceDto) {
    const studentId = req.user.sub;
    return await this.experiencesService.create({ ...createDto, student_id: studentId });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Experiences from an authenticated user/student' })
  async findMyExperiences(@Req() req: any) {
    const studentId = req.user.sub;
    return await this.experiencesService.findByStudentId(studentId);
  }

  @Patch('me/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user/student experiences' })
  async updateMyExperience(@Param('id') experienceId: string, @Body() updateDto: UpdateExperienceDto, @Req() req: any) {
    const studentId = req.user.sub;
    return await this.experiencesService.updateStudentExperience(studentId, experienceId, updateDto);
  }

  @Get('student/:studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View student experiecnes (from a business account)' })
  async findStudentExperiences(@Param('studentId') studentId: string) {
    return await this.experiencesService.findByStudentId(studentId);
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete experience from an authenticated user/student' })
  async remove(@Param('id') experienceId: string, @Req() req: any) {
    const studentId = req.user.sub;
    return await this.experiencesService.removeStudentExperience(studentId, experienceId);
  }
}