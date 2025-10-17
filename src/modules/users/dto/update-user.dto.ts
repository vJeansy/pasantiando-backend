import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { studentProfileDto } from './student-profile.dto';
import { businessProfileDto } from './business-profile.dto';
import { IsOptional, ValidateNested, IsString, IsEmail, MinLength, IsBoolean, Length, } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email_address?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    hashed_password?: string;

    @IsString({ message: 'La contraseña actual debe ser un texto válido' })
    @Length(1, 100, { message: 'La contraseña actual no puede estar vacía' })
    @IsOptional()
    current_password?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => studentProfileDto)
    student?: studentProfileDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => businessProfileDto)
    business?: businessProfileDto;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}