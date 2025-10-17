import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  exports: [ExperiencesService],
  imports: [PrismaModule]
})
export class ExperiencesModule {}
