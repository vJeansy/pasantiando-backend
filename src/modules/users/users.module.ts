import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserStudentsService } from './services/users-students.service';
import { UserStudentsController } from './controllers/users-students.controller';
import { EmailService } from '../email-service/email-service.service';

@Module({
  controllers: [UsersController, UserStudentsController,],
  providers: [UsersService, UserStudentsService, EmailService],
  exports: [UsersService, UserStudentsService,],
  imports: [PrismaModule]
})
export class UsersModule {}
