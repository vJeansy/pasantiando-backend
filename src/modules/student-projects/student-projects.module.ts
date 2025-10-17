import { Module } from '@nestjs/common';
import { StudentProjectsService } from './student-projects.service';
import { StudentProjectsController } from './student-projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentProjectsController],
  providers: [StudentProjectsService],
  exports: [StudentProjectsService],
})
export class StudentProjectsModule { }
