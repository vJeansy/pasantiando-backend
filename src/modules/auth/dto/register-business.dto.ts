import { RegisterDto } from './register.dto';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RegisterBusinessDto extends RegisterDto {

  @IsString()
  @IsNotEmpty()
  tax_id: string;

  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsPhoneNumber('DO')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  street_address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state_province: string;

  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

}