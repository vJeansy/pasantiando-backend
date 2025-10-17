// src/modules/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsDate, IsDateString } from 'class-validator';
import { RegisterDto } from './register.dto';
import { Type } from 'class-transformer';
import { IsOlderThan } from 'src/common/validators/is-older-than.validator';

export class RegisterStudentDto extends RegisterDto {
  @IsString()
  @IsOptional()
  headline?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOlderThan(16, { message: 'Debes ser mayor de 16 años para registrarte.' })
  birth_date: Date;

  @IsPhoneNumber('DO')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  national_id: string;
}