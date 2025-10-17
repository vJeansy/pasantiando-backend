import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new student', async () => {
    const dto = {
      first_name: 'Juan',
      last_name: 'Pérez',
      email_address: 'juan@example.com',
      hashed_password: '123456',
      headline: 'Bachiller',
      phone: '+18095551234',
      national_id: '40212345678',
      birth_date: new Date('2000-01-01'),
    };

    // Mock Prisma
    jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.users, 'create').mockResolvedValue({
      id: 1,
      ...dto,
      hashed_password: await bcrypt.hash(dto.hashed_password, 10),
    } as any);

    const result = await service.registerStudent(dto);
    expect(result).toHaveProperty('email_address', dto.email_address);
  });

  it('should throw if email already exists', async () => {
    const dto = {
      first_name: 'Juan',
      last_name: 'Pérez',
      email_address: 'juan@example.com',
      hashed_password: '123456',
      headline: 'Bachiller',
      phone: '+18095551234',
      national_id: '40212345678',
      birth_date: new Date('2000-01-01'),
    };

    jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(dto as any);

    await expect(service.registerStudent(dto)).rejects.toThrow(
      'El correo electrónico y/o cedula ingresado ya está en uso.',
    );
  });
});