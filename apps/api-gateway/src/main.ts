import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway');

  // Helmet
  app.use(helmet());

  // Enable CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 API Gateway running on http://localhost:${port}`);
  logger.log(`📡 Auth Service: ${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}`);
  logger.log(`📡 Product Service: ${process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002'}`);
  logger.log(`📡 Order Service: ${process.env.ORDER_SERVICE_URL || 'http://localhost:3003'}`);
}
bootstrap();
