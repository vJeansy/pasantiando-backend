import { IsBoolean, IsOptional, IsString, Length, IsPhoneNumber, IsDate, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsOlderThan } from 'src/common/validators/is-older-than.validator';

export class studentProfileDto {
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
  @Length(3, 255, { message: 'El enlace de LinkedIn debe tener entre 3 y 255 caracteres.' })
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
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser válida.' })
  @IsOlderThan(16, { message: 'Debes ser mayor de 16 años para registrarte.' })
  birth_date?: Date;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @Length(10, 10, {
    message: 'El número telefónico debe tener exactamente 10 dígitos.',
  })
  @IsPhoneNumber('DO', {
    message: 'El número debe ser un teléfono válido de República Dominicana.',
  })
  phone?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @Length(11, 11, {
    message: 'La cédula debe tener exactamente 11 dígitos.',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  national_id?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo de disposición para viajar debe ser verdadero o falso.' })
  willing_to_travel?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El campo de vehículo propio debe ser verdadero o falso.' })
  has_vehicle?: boolean;
}