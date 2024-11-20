// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger, ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe({ transform: true }));
//   app.useLogger(new Logger());

//   app.enableCors({
//     origin: ['http://localhost:5173', 'null'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
//     credentials: true, // Active l'envoi de cookies et autres informations d'authentification
//   });

//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const server = app.getHttpServer();
  server.setMaxListeners(20);
  app.useStaticAssets(path.join(__dirname, '..', 'uploads', 'images'), {
    prefix: '/uploads/images/',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(new Logger());

  app.enableCors({
    origin: ['http://localhost:5173', 'null'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Active l'envoi de cookies et autres informations d'authentification
  });

  await app.listen(3000);
}
bootstrap();
