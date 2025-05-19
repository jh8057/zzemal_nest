import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@common/filter/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Swagger UI 주소
    credentials: true, // 쿠키 허용 필수!
  });

  //swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('NestJS Swagger API example')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // dto validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값은 제거
      // forbidNonWhitelisted: true, // DTO에 없는 값이 있으면 에러
      transform: true, // 타입 자동 변환 (예: string -> number)
    }),
  );

  // exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
