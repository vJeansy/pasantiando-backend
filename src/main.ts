import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import * as express from 'express';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {

  dotenv.config(); // ✅ Loads .env into process.env

  const app = await NestFactory.create(AppModule);

  app.use(express.json());

  //app.useGlobalPipes(CustomValidationPipe); //configure properly the formatError.

  app.useGlobalPipes( // ✅ Loads and use globally the Pipes.
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    app.enableCors({
      origin: ['https://pasantiando.com'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true, //no cookies yet.
    })

  const config = new DocumentBuilder() // ✅Loads swagger for proper documentation.
    .setTitle('Pasantiando API Documentation')
    .setDescription('This is API documentation for the Interhub endpoints and how to use them')
    .setVersion('1.0')
    .addTag('Pasantiando')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  writeFileSync('swagger-spec.json', JSON.stringify(documentFactory()));
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();