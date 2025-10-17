import { internship_modality, internship_shift_type, internship_status } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateIntershipDto {
    @IsNotEmpty({ message: 'El titulo no puede estar vacio' })
    @MaxLength(100, { message: 'El titulo no puede exceder 100 caracteres.' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'La descripción no puede estar vacia' })
    @MaxLength(2050, { message: 'La descripción no puede exceder 2050 caracteres.' })
    @IsString()
    job_description: string;

    @IsArray({ message: 'Debes seleccionar al menos un requisito' })
    @ArrayNotEmpty({ message: 'La lista de requisitos no puede estar vacía' })
    @IsString({ each: true, message: 'Cada requisito debe ser un texto válido' })
    requirements: string[];

    @IsNotEmpty({ message: 'Ubicación no puede estar vacio' })
    @IsString()
    job_location: string;

    @IsNotEmpty({ message: 'Modalidad no puede estar vacio' })
    @IsString()
    @IsEnum(internship_modality, { message: 'Asegurate de elegir una modalidad' })
    modality: internship_modality;

    @IsNotEmpty({ message: 'Turno no puede estar vacio' })
    @IsString()
    @IsEnum(internship_shift_type, { message: 'Asegurate de elegir un turno' })
    shift_type: internship_shift_type;

    @IsEnum(internship_status)
    job_status: internship_status;

    @Type(() => Date)
    @IsOptional()
    started_date?: Date;

    @Type(() => Date)
    @IsOptional()
    end_date?: Date;
}
