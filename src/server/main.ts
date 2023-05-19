import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { serverEnv } from './server-env';
import { CorrelationIdMiddleware } from '@eropple/nestjs-correlation-id';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(app.get(Logger));
  app.flushLogs();

  app.use(CorrelationIdMiddleware());

  const config = new DocumentBuilder()
    .setTitle('ChiselTime API')
    .setDescription('API documentation for ChiselTime')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverEnv.PORT);
  return app;
}
