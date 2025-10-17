import { Controller, Get, Param, Req, UseGuards, ParseUUIDPipe, } from '@nestjs/common';
import { InternshipAnalyticsService } from '../services/internship-analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Internship Applicants')
@Controller('business/applicants')
export class IntershipAnalyticsController {
  constructor(private readonly analyticsService: InternshipAnalyticsService) { }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllApplicants(@Req() req: any) { //Devuelve todos los estudiantes que han aplicado a pasantías creadas por este negocio.
    const businessId = req.user.sub;
    return this.analyticsService.getAll(businessId);
  }

  @Get(':internshipId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getApplicantsByInternship(@Param('internshipId', ParseUUIDPipe) internshipId: string, @Req() req: any,) {
    const businessId = req.user.sub;
    return this.analyticsService.getApplicantsByInternship(businessId, internshipId);
  }
}