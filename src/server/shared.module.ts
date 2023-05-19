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
    redis: {
      host: serverEnv.REDIS_HOST,
      port: serverEnv.REDIS_PORT,
      username: serverEnv.REDIS_USER,
      password: serverEnv.REDIS_PASS,
    },
  }),
  ScheduleModule.forRoot(),
];

@Module({
  imports,
})
export class SharedModule {}
