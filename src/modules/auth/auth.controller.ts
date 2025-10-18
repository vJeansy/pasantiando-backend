import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Post('register/student')
    @ApiOperation({ summary: `Register a new student's account` })
    async registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
        /*try {
            const API_KEY = this.configService.get<string>('MAILBOXLAYER_API_KEY');
            if (!API_KEY) throw new Error('MailboxLayer API key is not configured.');
            const response = await axios.get(`http://apilayer.net/api/check?access_key=${API_KEY}&email=${registerStudentDto.email_address}`);
            const { format_valid, smtp_check } = response.data;
            if (!format_valid || !smtp_check) throw new UnauthorizedException('Email no verificable. Por favor, utiliza un email válido.');
        } catch (error) {
            throw new UnauthorizedException('No se pudo validar el correo electrónico, porfavor confirma que el correo electronico utilizado sea valido.');
        }*/
        return this.authService.registerStudent(registerStudentDto);
    }

    @Post('register/business')
    @ApiOperation({ summary: `Register a new business's ccount` })
    async registerBusiness(@Body() registerBusinessDto: RegisterBusinessDto) {
        /*try {
            const API_KEY = this.configService.get<string>('MAILBOXLAYER_API_KEY');
            if (!API_KEY) throw new Error('MailboxLayer API key is not configured.');
            const response = await axios.get(`http://apilayer.net/api/check?access_key=${API_KEY}&email=${registerBusinessDto.email_address}`);
            const { format_valid, smtp_check } = response.data;
            if (!format_valid || !smtp_check) throw new UnauthorizedException('Email no verificable. Por favor, utiliza un email válido.');
        } catch (error) {
            throw new UnauthorizedException('No se pudo validar el correo electrónico, porfavor confirma que el correo electronico utilizado sea valido.');
        }*/
        return this.authService.registerBusiness(registerBusinessDto);
    }

    @Post('login')
    @ApiOperation({ summary: `Log into the account` })
    async login(@Body() LoginDto: LoginDto) {
        const user = await this.authService.validateUser(LoginDto);
        return this.authService.login(LoginDto);
    }
}
