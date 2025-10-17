import { Module } from '@nestjs/common';
import { SkillService } from './services/skills.service';
import { StudentSkillService } from './services/student-skill.service';
import { SkillController } from './controllers/skills.controller';
import { StudentSkillController } from './controllers/student-skill.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SkillController, StudentSkillController],
  providers: [SkillService, StudentSkillService],
})
export class SkillModule {}