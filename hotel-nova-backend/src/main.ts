import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import cookieParser from 'cookie-parser';

const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];

function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Check your .env file.`,
    );
  }
}

async function bootstrap() {
  // rawBody: true tells NestJS to keep a copy of the raw request buffer on req.rawBody.
  // This is required by the Paystack webhook handler, which must verify the
  // HMAC-SHA512 signature against the exact bytes Paystack sent.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const logger = new Logger('Bootstrap');

  validateEnv();

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  // Support multiple origins so both local dev and production work.
  // FRONTEND_URL can be a comma-separated list: "https://hotel-nova.vercel.app,http://localhost:3000"
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger API documentation — available at /docs
  // The path is set to 'docs' which resolves to /docs (outside the api/v1 prefix)
  // because SwaggerModule.setup bypasses the global prefix.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HotelNova API')
    .setDescription('REST API for HotelNova Property Management System')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
