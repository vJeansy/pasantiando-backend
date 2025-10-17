// src/modules/auth/dto/login.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email_address: string;

  @IsString()
  @IsNotEmpty()
  hashed_password: string;
}