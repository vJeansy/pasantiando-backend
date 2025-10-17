import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateStudentProjectDto {
    @IsOptional()
    @IsUUID()
    student_id: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    technologies_used?: string;

    @IsString()
    @IsOptional()
    project_url?: string;

    @IsBoolean()
    is_personal: boolean;

    @IsOptional()
    created_at: string;
}
