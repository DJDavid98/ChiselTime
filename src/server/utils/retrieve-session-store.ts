import { LoggerService } from '@nestjs/common/services/logger.service';
import { Store } from 'express-session';
import Redis from 'ioredis';
import { serverEnv } from '../server-env';
import RedisStore from 'connect-redis';

export const retrieveSessionStore = async (
  logger: LoggerService,
): Promise<Store> => {
  logger.log('Configuring Redis client for session store…');
  const client = new Redis({
    port: serverEnv.REDIS_PORT,
    host: serverEnv.REDIS_HOST,
    username: serverEnv.REDIS_USER,
    password: serverEnv.REDIS_PASS,
    lazyConnect: true,
  });
  logger.log('Connecting to Redis client for session store…');
  await client.connect();
  logger.log('Connected to Redis client for session store');
  return new RedisStore({
    client,
    prefix: 'chiseltime:',
  });
};
