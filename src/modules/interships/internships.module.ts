import { Module } from '@nestjs/common';
import { InternshipsService } from './services/internships.service';
import { InternshipsController } from './controllers/internships.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { IntershipAnalyticsController } from './controllers/internship-analytics.controller';
import { InternshipAnalyticsService } from './services/internship-analytics.service';

@Module({
  controllers: [InternshipsController, IntershipAnalyticsController],
  providers: [InternshipsService, InternshipAnalyticsService],
  exports: [InternshipsService, InternshipAnalyticsService],
  imports: [PrismaModule, UsersModule],
})
export class InternshipsModule {}