import { IsOptional, IsString } from "class-validator";

export class FilterUserDto {
    @IsString()
    @IsOptional()
    email_address?: string;
}