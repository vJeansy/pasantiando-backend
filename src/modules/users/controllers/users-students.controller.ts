import { Body, Controller, InternalServerErrorException, Post, Req, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { studentProfileDto } from "../dto/student-profile.dto";
import { UserType } from "src/common/user-type-.enum";
import { UserStudentsService } from "../services/users-students.service";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UpdateStudentDto } from "../dto/update-student.dto";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import { OwnerGuard } from "src/modules/auth/strategies/owner.guard";
import { AdminGuard } from "src/modules/auth/strategies/admin.guard";

@ApiTags('Students')
@Controller('users/students')
export class UserStudentsController {
    constructor(private readonly studentsService: UserStudentsService) { }

    /*@Post('/register')
    @ApiCreatedResponse({ description: 'User successfully created.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Invalid format used.' })
    @ApiOperation({ summary: `Create new user.` })
    async createStudent(@Body() body: studentProfileDto) {
        try {
            const result = await this.studentsService.CreateNewStudent(body);
            return { message: 'Usuario de estudiante creada satisfactoriamente.', studentId: result.id,}
        } catch (error: any) {
            throw new InternalServerErrorException(`Error al intentar crear usuario estudiantil: ${error.message}`);
        };
    };*/

    @Get('all-students')
    @UseGuards(AdminGuard)
    async findAllStudent() {
        try {
            const result = await this.studentsService.findStudents()
            return { message: 'Usuarios studiantil encontrados.', students: result, }
        } catch (error: any) {
            throw new InternalServerErrorException(`Error al intentar obtener usuarios estudiantil: ${error.message}`);
        }
    }

    @Patch('update/me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, OwnerGuard)
    async findMyInformation(@Body() updateDto: UpdateStudentDto, @Req() req: any) {
        try {
            const userId = req.user.sub;
            return await this.studentsService.updateStudent(userId, updateDto);
        } catch (error: any) {
            throw new InternalServerErrorException(`Error al intentar actualizar los datos del estudiante: ${error.message}`);
        }
    }
}