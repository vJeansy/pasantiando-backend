import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode } from '@nestjs/common';
import { StudentProjectsService } from './student-projects.service';
import { CreateStudentProjectDto } from './dto/create-student-project.dto';
import { UpdateStudentProjectDto } from './dto/update-student-project.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/strategies/admin.guard';

@ApiTags('Student Projects')
@Controller('student-projects')
export class StudentProjectsController {
  constructor(private readonly studentProjectsService: StudentProjectsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'New project successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiOperation({ summary: `Create a new studet's project` })
  async create(@Req() req: any, @Body() createDto: CreateStudentProjectDto) {
    const studentId = req.user.sub;
    return await this.studentProjectsService.create({ ...createDto, student_id: studentId });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Projects from an authenticated user/student' })
  async findMyProjects(@Req() req: any) {
    const studentId = req.user.sub;
    return await this.studentProjectsService.findByStudentId(studentId);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obtain projects by ID' }) // For admin only
  async findOne(@Param('id') id: string) {
    return await this.studentProjectsService.findOne(id);
  }

  @Patch('me/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user/student project' })
  async updateMyProject(@Param('id') projectId: string, @Body() updateDto: UpdateStudentProjectDto, @Req() req: any) {
    const studentId = req.user.sub;
    return await this.studentProjectsService.updateStudentProject(projectId, studentId, updateDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user project as admin' }) // for admin mode only
  async update(@Param('id') projectId: string, @Body() updateDto: UpdateStudentProjectDto) {
    return await this.studentProjectsService.update(projectId, updateDto);
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete experience from an authenticated user/student' })
  async removeMyExperience(@Param('id') projectId: string, @Req() req: any) {
    const studentId = req.user.sub;
    return await this.studentProjectsService.removeMyExperience(studentId, projectId);
  }


  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete user project as admin' }) // for admin mode only
  async remove(@Param('id') id: string) {
    return await this.studentProjectsService.remove(id);
  }
}
