import { Controller, Get, Post, Body, Patch, Param, Delete, Request, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { InternshipsService } from '../services/internships.service';
import { CreateIntershipDto } from '../dto/create-internship.dto';
import { UpdateIntershipDto } from '../dto/update-internship.dto';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiBadRequestResponse, ApiTags, ApiBearerAuth, ApiFoundResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Internships')
@Controller('internships')
export class InternshipsController {
  constructor(
    private readonly intershipsService: InternshipsService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Intership successfully created' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: "Invalid format used" })
  @ApiOperation({ summary: `Create Internship` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createIntershipDto: CreateIntershipDto, @Request() req: any) {
    const businessId = req.user.sub;
    return this.intershipsService.create(createIntershipDto, businessId);
  }

  @Get()
  @ApiBadRequestResponse({ description: "Invalid format used" })
  @ApiOperation({ summary: `Obtain all internships` })
  findAll() {
    return this.intershipsService.findAll();
  }

  @Get('/available')
  @ApiBadRequestResponse({ description: "Invalid format used" })
  @ApiOperation({ summary: `Obtain all internships` })
  findAvailableInternships() {
    return this.intershipsService.findOpenedStatus();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Interships' })
  @ApiOperation({ summary: `Obtain internship by id` })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const internship = await this.intershipsService.findOne(id);
    if (!internship) throw new NotFoundException('Internship not found');
    return internship;
  }

  @Get('/recommended/:studentId')
  @ApiOperation({ summary: 'Obtener pasantías recomendadas para un estudiante' })
  async getRecommendedInternships(@Param('studentId') id: string) {
    return this.intershipsService.recommendedInternships(id);
  }

  @Patch('/update/:id')
  @ApiFoundResponse({ description: 'Intership found' })
  @ApiNotFoundResponse({ description: 'Intership not found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Update internship` })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateIntershipDto: UpdateIntershipDto) {
    return this.intershipsService.update(id, updateIntershipDto);
  }

  @Delete('/delete/:id')
  @ApiFoundResponse({ description: 'Intership found' })
  @ApiNotFoundResponse({ description: 'Intership not found' })
  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete internship` })
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.intershipsService.remove(id);
  }
}
