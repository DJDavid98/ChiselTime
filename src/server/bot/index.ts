import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(BotModule);
}

bootstrap();
