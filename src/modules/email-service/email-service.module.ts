import { Module } from '@nestjs/common';
import { EmailService } from './email-service.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailServiceModule {}
