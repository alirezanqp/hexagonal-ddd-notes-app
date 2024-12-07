import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from '@common/infrastructure/configs/app.config';
import { setupSwagger } from '@common/infrastructure/utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableVersioning();

  // enable cors for all origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  /*
   This line of code enables shutdown hooks for the app object.
   Shutdown hooks are functions that are automatically called when the application is shutting down.
   In this case, it allows the application to perform any necessary cleanup or finalization tasks before it exits.
  */
  app.enableShutdownHooks();

  if (appConfig.isDevelopment) {
    setupSwagger(app);
  }

  await app.listen(appConfig.port);
}
bootstrap();
