import { IsUUID, IsString, IsOptional, IsBoolean, IsDateString, Length } from 'class-validator';

export class CreateExperienceDto {
    @IsOptional()
    @IsUUID()
    student_id: string;

    @IsString()
    @Length(1, 100)
    company_name: string;

    @IsString()
    @Length(1, 100)
    role_title: string;

    @IsOptional()
    @IsDateString()
    start_date?: string;

    @IsOptional()
    @IsDateString()
    end_date?: string;

    @IsOptional()
    @IsBoolean()
    is_current?: boolean;

    @IsOptional()
    @IsString()
    description?: string;
}