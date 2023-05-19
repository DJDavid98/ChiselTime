import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewModule } from './view/view.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DiscordUsersModule } from './discord-users/discord-users.module';
import { StateModule } from './state/state.module';
import dataSource from './common/data-source';
import { LoggerModule } from 'nestjs-pino';
import { Request, Response } from 'express';
import { getRandomUuid } from './utils/random';
import { PatreonUsersModule } from './patreon-users/patreon-users.module';

@Module({
  imports: [
    UsersModule,
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
        level: 'debug',
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
    AuthModule,
    DiscordUsersModule,
    ViewModule,
    StateModule,
    PatreonUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
