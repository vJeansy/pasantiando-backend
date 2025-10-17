import { Module } from '@nestjs/common';
import { LanguageService } from './services/language.service';
import { StudentLanguageService } from './services/student-language.service';
import { LanguageController } from './controllers/language.controller';
import { StudentLanguageController } from './controllers/student-language.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LanguageController, StudentLanguageController],
  providers: [LanguageService, StudentLanguageService],
})
export class LanguageModule {}