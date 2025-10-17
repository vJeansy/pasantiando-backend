import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailService } from '../email-service/email-service.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, EmailService],
  exports: [ApplicationsService],
  imports: [PrismaModule, NotificationModule]
})
export class ApplicationsModule {}
