import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { serverEnv } from './server-env';
import { CorrelationIdMiddleware } from '@eropple/nestjs-correlation-id';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import session from 'express-session';
import { retrieveSessionSecret } from './utils/retrieve-session-secret';
import { retrieveSessionStore } from './utils/retrieve-session-store';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const logger = app.get(Logger);
  app.use(
    session({
      secret: (await retrieveSessionSecret(logger)).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: !serverEnv.LOCAL,
        sameSite: true,
      },
      store: await retrieveSessionStore(logger),
    }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(logger);
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
