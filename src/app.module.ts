import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { config } from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { InternshipsModule } from './modules/interships/internships.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { SkillModule } from './modules/skills/skills.module';
import { LanguageModule } from './modules/languages/language.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { StudentProjectsModule } from './modules/student-projects/student-projects.module';

config();

@Module({
    imports: [
      UsersModule, AuthModule, InternshipsModule, ApplicationsModule, SkillModule,
      LanguageModule, ExperiencesModule, StudentProjectsModule, PrismaModule,
      ConfigModule.forRoot({
      isGlobal: true, // 👈 Make ConfigModule available everywhere
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
