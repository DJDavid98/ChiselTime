import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './common/data-source';
import { LoggerModule } from 'nestjs-pino';
import { Request, Response } from 'express';
import { getRandomUuid } from './utils/random';
import { BullModule } from '@nestjs/bull';
import { serverEnv } from './server-env';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisClientOptions, RedisModule } from '@liaoliaots/nestjs-redis';

const redisConfig: RedisClientOptions = {
  port: serverEnv.REDIS_PORT,
  host: serverEnv.REDIS_HOST,
  username: serverEnv.REDIS_USER,
  password: serverEnv.REDIS_PASS,
  keyPrefix: serverEnv.REDIS_PREFIX,
};

const imports = [
  ConfigModule.forRoot(),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [],
    useFactory: () => ({}),
    dataSourceFactory: async () => {
      await dataSource.initialize();
      return dataSource;
    },
  }),
  LoggerModule.forRoot({
    pinoHttp: {
      genReqId: function (req: Request, res: Response) {
        const existingID = req.id ?? req.headers['x-correlation-id'];
        if (existingID) return existingID;
        const id = getRandomUuid();
        res.setHeader('X-Correlation-Id', id);
        return id;
      },
      level: serverEnv.LOG_LEVEL,
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            }
          : undefined,

      autoLogging: false,
      quietReqLogger: true,
    },
  }),
  BullModule.forRoot({
    redis: redisConfig,
  }),
  ScheduleModule.forRoot(),
  RedisModule.forRoot({
    config: {
      ...redisConfig,
      lazyConnect: true,
    },
    errorLog: true,
    readyLog: true,
    closeClient: true,
  }),
];

@Module({
  imports,
})
export class SharedModule {}
