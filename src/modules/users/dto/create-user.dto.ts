import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, Length, IsNotEmpty, Matches, ValidateNested, IsEnum, IsDateString, } from 'class-validator';
import { studentProfileDto } from './student-profile.dto';
import { businessProfileDto } from './business-profile.dto';
import { UserType } from 'src/common/user-type-.enum';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Este campo no puede permanecer vacío.' })
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @Matches(/^[a-zA-ZÀ-ÿ\s\-']*$/, {
        message: 'Solo se permiten letras, espacios, guiones y apóstrofes.',
    })
    @Length(2, 50, {
        message: 'El nombre debe tener entre 2 y 50 caracteres.',
    })
    @Transform(({ value }) => value.toLowerCase())
    first_name: string;

    @IsNotEmpty({ message: 'Este campo no puede permanecer vacío.' })
    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    @Matches(/^[a-zA-ZÀ-ÿ\s\-']*$/, {
        message: 'Solo se permiten letras, espacios, guiones y apóstrofes.',
    })
    @Length(2, 50, {
        message: 'El apellido debe tener entre 2 y 50 caracteres.',
    })
    @Transform(({ value }) => value.toLowerCase())
    last_name: string;

    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
    @Transform(({ value }) => value.toLowerCase())
    email_address: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    hashed_password: string;

    @IsNotEmpty({ message: 'Debe especificar el tipo de usuario.' })
    @IsEnum(UserType, {
        message: 'El tipo de usuario debe ser uno de los valores permitidos.',
    })
    user_type: UserType;

    @IsOptional()
    @IsBoolean({ message: 'El estado activo debe ser verdadero o falso.' })
    is_active?: boolean;

    @IsDateString({}, { message: 'La fecha de actualización debe tener formato ISO válido.' })
    updated_at: string;

    @IsOptional()
    @IsString({ message: 'El campo updated_by debe ser una cadena de texto.' })
    updated_by?: string;

    @IsOptional()
    @ValidateNested({ message: 'El perfil estudiantil no es válido.' })
    @Type(() => studentProfileDto)
    student?: studentProfileDto;

    @IsOptional()
    @ValidateNested({ message: 'El perfil empresarial no es válido.' })
    @Type(() => businessProfileDto)
    business?: businessProfileDto;
}