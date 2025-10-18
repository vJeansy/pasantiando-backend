import { IsBoolean, IsOptional, IsString, Length, Matches, } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStudentDto {
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value?.toLowerCase())
    @Matches(/^[a-zA-ZÀ-ÿ\s\-']*$/, {
        message: 'Solo se permiten letras, espacios, guiones y apóstrofes.',
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    first_name?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value?.toLowerCase())
    @Matches(/^[a-zA-ZÀ-ÿ\s\-']*$/, {
        message: 'Solo se permiten letras, espacios, guiones y apóstrofes.',
    })
    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    last_name?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value?.toLowerCase())
    @Matches(/^[a-zA-ZÀ-ÿ\s\-']*$/, {
        message: 'Solo se permiten letras, espacios, guiones y apóstrofes.',
    })
    @IsString({ message: 'El segundo nombre debe ser una cadena de texto.' })
    middle_name?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value?.toLowerCase())
    @Matches(/^[a-zA-ZÀ-ÿ\s\-']*$/, {
        message: 'Solo se permiten letras, espacios, guiones y apóstrofes.',
    })
    @IsString({ message: 'El apellido materno debe ser una cadena de texto.' })
    maiden_name?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    street_address?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
    city?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'La provincia debe ser una cadena de texto.' })
    state_province?: string;

    @IsOptional()
    @IsString({ message: 'El municipio debe ser una cadena de texto.' })
    @Length(3, 100, { message: 'El municipio debe tener entre 3 y 100 caracteres.' })
    municipio?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'El código postal debe ser una cadena de texto.' })
    postal_code?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'El país debe ser una cadena de texto.' })
    country?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'La URL del CV debe ser una cadena de texto.' })
    resume_url?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'El enlace de LinkedIn debe ser una cadena de texto.' })
    @Length(3, 255, {
        message: 'El enlace de LinkedIn debe tener entre 3 y 255 caracteres.',
    })
    linkedin_url?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'La URL de la foto debe ser una cadena de texto.' })
    profile_picture_url?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'El titular debe ser una cadena de texto.' })
    headline?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'El título del resumen debe ser una cadena de texto.' })
    summary_title?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString({ message: 'El resumen debe ser una cadena de texto.' })
    summary?: string;

    @IsOptional()
    @IsBoolean({
        message: 'El campo de disposición para viajar debe ser verdadero o falso.',
    })
    willing_to_travel?: boolean;

    @IsOptional()
    @IsBoolean({
        message: 'El campo de vehículo propio debe ser verdadero o falso.',
    })
    has_vehicle?: boolean;
}