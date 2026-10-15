import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/jwtauth.guard';
import { LoggingInterceptor } from './loggin.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  
  app.enableCors();
  
  // 🔒 GLOBAL VALIDATION PIPE - BOPLA PROTECTION
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,                    // Strip properties not in DTO
    forbidNonWhitelisted: true,         // Throw 400 if extra properties sent
    transform: true,                    // Auto-transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true,   // Convert "123" → 123 for @IsNumber()
    },
    disableErrorMessages: process.env.NODE_ENV === 'production', // Hide details in prod
    validationError: { target: false }, // Don't return the validated object in errors
  }));
  
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  
  const config = new DocumentBuilder()
    .setTitle('VigixAI Chatbot')
    .setDescription('chatbot vigixai')
    .setVersion('1.0')
    .addTag('vigixai-chatbot')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  
  await app.listen(3111);
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
