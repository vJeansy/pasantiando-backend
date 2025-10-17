import { IsString, IsEmail, IsNotEmpty, IsAlpha, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    @Length(2, 50)
    @Transform(({ value }) => value.toLowerCase())
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    @Length(2, 50)
    @Transform(({ value }) => value.toLowerCase())
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    email_address: string;

    @IsString()
    @IsNotEmpty()
    hashed_password: string;
}