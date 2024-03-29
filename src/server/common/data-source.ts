import { DataSource, LogLevel } from 'typeorm';
import defaultConfig from '../ormconfig.json';
import { serverEnv } from '../server-env';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default new DataSource({
  ...(defaultConfig as unknown as PostgresConnectionOptions),
  logging: serverEnv.LOCAL
    ? Array.isArray(defaultConfig.logging)
      ? (defaultConfig.logging as LogLevel[])
      : defaultConfig.logging
    : ['error'],
  host: serverEnv.DATABASE_HOST || defaultConfig.host,
  port: serverEnv.DATABASE_PORT || defaultConfig.port,
  username: serverEnv.DATABASE_USER || defaultConfig.username,
  password: serverEnv.DATABASE_PASS || defaultConfig.password,
  database: serverEnv.DATABASE_NAME || defaultConfig.database,
});
