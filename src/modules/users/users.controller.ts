import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filet-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiFoundResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard } from '../auth/strategies/owner.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { UserType } from 'src/common/user-type-.enum';
import { AdminGuard } from '../auth/strategies/admin.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ description: 'User successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Invalid format used.' })
  @ApiOperation({ summary: `Create new user.` })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para crear usuarios. ${err}`);
    }
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOkResponse({ description: 'Users' })
  @ApiOperation({ summary: `Obtain all user's information as admin.` }) // modo administrador aun esta pendiente a desarrollar.
  async findAllUsers(@Query() FilterUserDto: FilterUserDto) {
    try {
      return await this.usersService.findAllUsers(FilterUserDto);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para obtener los usuaruios. ${err}`);
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Authenticated user profile.' })
  @ApiOperation({ summary: `Obtain profile's information from authenticated account.` })
  async viewMyUserProfile(@Request() req: any) {
    try {
      const userId = req.user.sub;
      return await this.usersService.findOne(userId);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para obtener mis datos de perfil. ${err}`);
    }
  }

  @Get('student/:studentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Authenticated user profile.' })
  @ApiOperation({ summary: `Read user's profile of an student as a business account.` })
  async viewStudentProfile(@Request() req: any, @Param('studentId') studentId: string) {
    try {
      /*const userId = req.user;
      if (userId.user_type !== UserType.BUSINESS) throw new BadRequestException(`Solo las cuentas empresariales tienen permitido ver perfiles de estudiantes.`);*/
      return await this.usersService.findOne(studentId);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para obtener los datos de un perfil de estudiante desde una cuenta empresarial. ${err}`);
    }
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOkResponse({ description: 'id found.' })
  @ApiFoundResponse({ description: 'User found.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiOperation({ summary: `Obtain user's information by ID as admin.` }) // modo administrador aun esta pendiente a desarrollar.
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para obtener usuario por id. ${err}`);
    }
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBadRequestResponse({ description: "Invalid format used." })
  @ApiOkResponse({ description: 'User successfully updated.' })
  @ApiResponse({ status: 401, description: "User type and email can not be changed." })
  @ApiOperation({ summary: `User's owned update's account.` })
  async updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    try {
      const userId = req.user.sub;
      return await this.usersService.updateUser(userId, updateUserDto);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para actualizar mi perfil. ${err}`);
    }
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBadRequestResponse({ description: "Invalid format used." })
  @ApiOkResponse({ description: 'User successfully updated.' })
  @ApiResponse({ status: 401, description: "User type and email can not be changed." })
  @ApiOperation({ summary: `Update user's information as admin.` }) // modo administrador aun esta pendiente a desarrollar.
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.updateUser(id, updateUserDto);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para actualizar usuario por id. ${err}`);
    }
  }

  @Patch('me/deactivate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiOperation({ summary: `User's owned delete account.` })
  async softRemove(@Req() req: any) {
    try {
      const userId = req.user.sub;
      return await this.usersService.softRemove(userId);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para desactivar la cuenta. ${err}`);
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiOperation({ summary: 'Delete user as admin.' }) // modo administrador aun esta pendiente a desarrollar.
  async remove(@Param('id') id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (err) {
      throw new InternalServerErrorException(`Error de controlador para eliminar usuario por id. ${err}`);
    }
  }
}
