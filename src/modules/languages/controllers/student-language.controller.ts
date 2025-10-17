import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req, Header } from '@nestjs/common';
import { StudentLanguageService } from '../services/student-language.service';
import { AssignStudentLanguageDto } from '../dtos/assign-student-language.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Student-languages')
@Controller('student-languages')
export class StudentLanguageController {
  constructor(private readonly studentLanguageService: StudentLanguageService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Assign language`})
  async assign(@Body() dto: AssignStudentLanguageDto, @Req() req: any) {
    const userId = req.user.sub;
    return await this.studentLanguageService.assignFromUser(userId, dto.languageId, dto.proficiencyLevel);
  }

  @Get(':studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Obtain language from a user`})
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.studentLanguageService.findByStudent(studentId);
  }

  @Delete('me/:languageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Delete language from user`})
  async removeFromMe(@Param('languageId') languageId: string, @Req() req: any) {
    const userId = req.user.sub;
    return await this.studentLanguageService.removeFromUser(userId, languageId);
  }

  @Delete(':studentId/:languageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: `Dele language`})
  async remove(@Param('studentId') studentId: string, @Param('languageId') languageId: string) {
    return await this.studentLanguageService.remove(studentId, languageId);
  }
}