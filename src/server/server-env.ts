import { config } from 'dotenv';
import * as process from 'process';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });

const {
  PORT,
  LOCAL,
  LOG_LEVEL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASS,
  PUBLIC_HOST,
  UA_STRING,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_CLIENT_SCOPES,
  DISCORD_BOT_TOKEN,
  DISCORD_INVITE_URL,
  DISCORD_TEST_GUILD_ID,
  PATREON_CLIENT_ID,
  PATREON_CLIENT_SECRET,
} = process.env;

/**
 * Type-safe process.env
 */
export const serverEnv = (() => {
  const values = {
    PORT: PORT || 3000,
    LOCAL: LOCAL === 'true',
    LOG_LEVEL,
    DATABASE_HOST,
    DATABASE_PORT: DATABASE_PORT ? parseInt(DATABASE_PORT) : undefined,
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME,
    REDIS_HOST,
    REDIS_PORT: REDIS_PORT ? parseInt(REDIS_PORT) : undefined,
    REDIS_USER,
    REDIS_PASS,
    PUBLIC_HOST,
    UA_STRING,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_CLIENT_SCOPES,
    DISCORD_BOT_TOKEN,
    DISCORD_INVITE_URL,
    DISCORD_TEST_GUILD_ID: DISCORD_TEST_GUILD_ID || '',
    PATREON_CLIENT_ID,
    PATREON_CLIENT_SECRET,
  };

  type Values = typeof values;

  Object.keys(values).forEach((key) => {
    if (typeof values[key as keyof Values] !== 'undefined') return;

    throw new Error(`${key} server environment variable not set`);
  });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
