import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsPhoneNumber, IsString, Length, MaxLength, IsNotEmpty, } from 'class-validator';

export class businessProfileDto {
    @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio.' })
    @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto.' })
    @Length(2, 100, { message: 'El nombre de la empresa debe tener entre 2 y 100 caracteres.' })
    business_name: string;

    @IsNotEmpty({ message: 'La industria es obligatoria.' })
    @IsString({ message: 'La industria debe ser una cadena de texto.' })
    @Length(2, 100, { message: 'La industria debe tener entre 2 y 100 caracteres.' })
    industry: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    @Length(3, 255, { message: 'La dirección debe tener entre 3 y 255 caracteres.' })
    street_address?: string;

    @IsOptional()
    @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
    @Length(3, 100, { message: 'La ciudad debe tener entre 3 y 100 caracteres.' })
    city?: string;

    @IsOptional()
    @IsString({ message: 'La provincia debe ser una cadena de texto.' })
    @Length(3, 100, { message: 'La provincia debe tener entre 3 y 100 caracteres.' })
    state_province?: string;

    @IsOptional()
    @IsString({ message: 'El municipio debe ser una cadena de texto.' })
    @Length(3, 100, { message: 'El municipio debe tener entre 3 y 100 caracteres.' })
    municipio?: string;

    @IsOptional()
    @IsString({ message: 'El código postal debe ser una cadena de texto.' })
    @Length(3, 20, { message: 'El código postal debe tener entre 3 y 20 caracteres.' })
    postal_code?: string;

    @IsOptional()
    @IsString({ message: 'El país debe ser una cadena de texto.' })
    @Length(3, 100, { message: 'El país debe tener entre 3 y 100 caracteres.' })
    country?: string;

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString({ message: 'El enlace de LinkedIn debe ser una cadena de texto.' })
    @Length(3, 255, { message: 'El enlace de LinkedIn debe tener entre 3 y 255 caracteres.' })
    linkedin_url?: string;

    @IsOptional()
    @IsString({ message: 'El resumen debe ser una cadena de texto.' })
    @Length(3, 2050, { message: 'El resumen debe tener entre 3 y 2050 caracteres.' })
    summary?: string;

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString({ message: 'La página web debe ser una cadena de texto.' })
    @Length(3, 255, { message: 'La página web debe tener entre 3 y 255 caracteres.' })
    web_page?: string;

    @IsOptional()
    @IsPhoneNumber('DO', { message: 'El número de teléfono debe ser válido en República Dominicana.' })
    phone?: string;

    @IsOptional()
    @IsString({ message: 'El correo de contacto debe ser una cadena de texto.' })
    @MaxLength(100, { message: 'El correo de contacto no debe exceder los 100 caracteres.' })
    contact_email?: string;

    @IsOptional()
    @IsString({ message: 'El RNC debe ser una cadena de texto.' })
    @MaxLength(50, { message: 'El RNC no debe exceder los 50 caracteres.' })
    tax_id?: string;

    @IsOptional()
    @IsBoolean({ message: 'El campo de verificación debe ser verdadero o falso.' })
    is_verified?: boolean;

    @IsOptional()
    @IsBoolean({ message: 'El campo de estado activo debe ser verdadero o falso.' })
    is_active?: boolean;

    @IsOptional()
    @IsString({ message: 'La URL del logo debe ser una cadena de texto.' })
    @MaxLength(255, { message: 'La URL del logo no debe exceder los 255 caracteres.' })
    logo_url?: string;
}