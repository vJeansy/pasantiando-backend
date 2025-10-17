import { Controller, Post, Get, Delete, Body, Param, Req } from '@nestjs/common';
import { StudentSkillService } from '../services/student-skill.service';
import { AssignStudentSkillDto } from '../dtos/assign-student-skill.dto';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('student-skills')
export class StudentSkillController {
  constructor(private readonly studentSkillService: StudentSkillService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async assign(@Body() dto: AssignStudentSkillDto, @Req() req: any) {
    const userId = req.user.sub;
    return await this.studentSkillService.assignFromUser(userId, dto.skillId, dto.proficiencyLevel);
  }

  @Get(':studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.studentSkillService.findByStudent(studentId);
  }

  @Delete('me/:skillId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeFromMe(@Param('skillId') skillId: string, @Req() req: any) {
    const userId = req.user.sub;
    return await this.studentSkillService.removeFromUser(userId, skillId);
  }

  @Delete(':studentId/:skillId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('studentId') studentId: string, @Param('skillId') skillId: string) {
    return await this.studentSkillService.remove(studentId, skillId);
  }

}