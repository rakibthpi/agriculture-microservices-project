import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import {AppModule} from "./app.module";
import {AllExceptionsFilter} from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
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

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`🚀 Order Service running on http://localhost:${port}`);
}
bootstrap();
