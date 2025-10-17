import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post(':internshipId')
  @ApiCreatedResponse({ description: 'Application successfully created' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Create a new application` })
  @UseGuards(JwtAuthGuard)
  create(@Param('internshipId') internshipId: string, @Request() req: any) {
    const studentId = req.user.sub;
    return this.applicationsService.create(internshipId, studentId);
  }

  @Get()
  @ApiOkResponse({ description: 'Applications retrieved successfully' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Obtain all application` })
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    const studentId = req.user.sub;
    return this.applicationsService.findAll(studentId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Application retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Obtain application by id` })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }


  @Patch(':id')
  @ApiOkResponse({ description: 'Application updated successfully' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Update application's data` })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string) {
    return this.applicationsService.update(id);
  }

  // applications.controller.ts
  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard)
  async respondToApplication(
    @Param('id', ParseUUIDPipe) applicationId: string,
    @Body() body: {
      status: 'accepted' | 'rejected';
      sendEmail?: boolean;
      emailSubject?: string;
      emailBody?: string;
    },
    @Req() req: any,
  ) {
    const businessId = req.user.sub;
    return this.applicationsService.respondToApplication(applicationId, businessId, body);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Application deleted successfully' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete application` })
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}
