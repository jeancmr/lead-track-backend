import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiVersionPath = 'api/v1';

  app.setGlobalPrefix(apiVersionPath);
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Lead Track RESTFul API')
    .setDescription('Lead track endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(apiVersionPath, app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() =>
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`),
  )
  .catch(console.error);
