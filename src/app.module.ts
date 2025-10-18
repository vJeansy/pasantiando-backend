import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { InternshipsModule } from './modules/interships/internships.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { SkillModule } from './modules/skills/skills.module';
import { LanguageModule } from './modules/languages/language.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { StudentProjectsModule } from './modules/student-projects/student-projects.module';

@Module({
    imports: [
      UsersModule, AuthModule, InternshipsModule, ApplicationsModule, SkillModule,
      LanguageModule, ExperiencesModule, StudentProjectsModule, PrismaModule,
      ConfigModule.forRoot({
      isGlobal: true, // Config module disponible de manera global.
      envFilePath: '.env' // Este archivo será copiado dinámicamente por tus scripts
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
