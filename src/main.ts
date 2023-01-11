import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './vendors/filters/http-exception.filter';
import { LoggingInterceptor } from './vendors/interceptors/logging.interceptor';
import { Logger } from './common/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger(),
    cors: true,
  });

  app.enableCors();
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = parseInt(process.env.APP_PORT, 10) || 80;
  await app.listen(port, '0.0.0.0', () => {
    new Logger().log(`Service started successfully at port: ${port}`);
  });
}

// tslint:disable-next-line: no-floating-promises
bootstrap();
