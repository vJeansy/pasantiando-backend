import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { studentProfileDto } from "../dto/student-profile.dto";
import { UserType } from "src/common/user-type-.enum";
import { UpdateUserDto } from "../dto/update-user.dto";
import { getCurriculumSelect, getEducationSelect, getExperienceSelect, getProjectSelect } from "src/utils/selects/curriculum-select.util";
import { Prisma } from "@prisma/client";
import { UpdateStudentDto } from "../dto/update-student.dto";

@Injectable()
export class UserStudentsService {
    constructor(private readonly prisma: PrismaService) { }

    /*async CreateNewStudent(profile: studentProfileDto): Promise<{ id: string }> {
        try {
            const student = await this.prisma.users.create({
                data: {
                    ...profile,
                    user_type: UserType.STUDENT,
                },
                select: { id: true },
            })
        } catch (error) {
            throw new Error(`Error al crear usuario estudiantil: ${error.message}`);
        }
    }*/

    async findStudents() {
        try {
            const allStudents = await this.prisma.users.findMany({
                where: { user_type: UserType.STUDENT },
                include: {
                    students: {
                        select: {
                            ...(getCurriculumSelect()),
                            student_skills: { include: { skills: true } },
                            student_languages: { include: { languages: true } },
                            student_projects: { select: getProjectSelect() },
                            student_experience: { select: getExperienceSelect() },
                            student_education: { select: getEducationSelect() },
                        },
                    },
                },
            });
            // Retorna los usuarios de estudiantes combinados con la tabla users.
            return allStudents.map(({
                hashed_password,
                id,
                user_type,
                is_active,
                updated_at,
                updated_by,
                students,
                ...rest }) => {
                const {
                    id: studentId,
                    ...safeStudent } = students ?? {};
                return {
                    ...rest,
                    students: safeStudent,
                }
            });
        } catch (error) {
            throw new Error(`Error al intentar obtejer estudiantes: ${error.message}`);
        }
    }

    async updateStudent(userId: string, updateDto: UpdateStudentDto) {
        try {
            // Validar existencia del usuario
            const student = await this.prisma.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    students: {
                        select: {
                            ...(getCurriculumSelect()),
                            student_skills: { include: { skills: true } },
                            student_languages: { include: { languages: true } },
                            student_projects: { select: getProjectSelect() },
                            student_experience: { select: getExperienceSelect() },
                            student_education: { select: getEducationSelect() },
                        },
                    },
                },
            });

            if (!student) throw new NotFoundException('Usuario no encontrado');

            // Separar campos de users y students
            const userFields = ['first_name', 'last_name'];
            const userData: Partial<Prisma.usersUpdateInput> = {};
            const studentData: Partial<Prisma.usersUpdateInput> = {};

            for (const [key, value] of Object.entries(updateDto)) {
                if (value === undefined) continue;
                if (userFields.includes(key)) {
                    userData[key as keyof Prisma.usersUpdateInput] = value;
                } else {
                    studentData[key as keyof Prisma.usersUpdateInput] = value;
                }
            }

            // Ejecutar actualización combinada
            const updatedStudent = await this.prisma.users.update({
                where: { id: userId },
                data: {
                    ...userData,
                    students: {
                        update: studentData,
                    },
                },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    students: {
                        select: {
                            ...(getCurriculumSelect()),
                            student_skills: { include: { skills: true } },
                            student_languages: { include: { languages: true } },
                            student_projects: { select: getProjectSelect() },
                            student_experience: { select: getExperienceSelect() },
                            student_education: { select: getEducationSelect() },
                        },
                    },
                },
            });

            return updatedStudent;
        } catch (error) {
            throw new InternalServerErrorException(`Error al intentar actualizar los datos del estudiante: ${error.message}`,);
        }
    }
}