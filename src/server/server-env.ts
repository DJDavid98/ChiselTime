import { config } from 'dotenv';
import * as process from 'process';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });

const bool = (envVar: string | undefined): boolean => envVar === 'true';
const int = (envVar: string | undefined): number | undefined =>
  envVar ? parseInt(envVar) : undefined;

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
  SESSION_SECRET_KEY_PATH,
  SESSION_COOKIE_SECURE,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_CLIENT_SCOPES,
  DISCORD_BOT_TOKEN,
  DISCORD_INVITE_URL,
  DISCORD_TEST_GUILD_ID,
  DISCORD_BOT_ENABLED,
  PATREON_CLIENT_ID,
  PATREON_CLIENT_SECRET,
  npm_lifecycle_script,
} = process.env;

/**
 * Type-safe process.env
 */
export const serverEnv = (() => {
  const values = {
    PORT: PORT || 3000,
    LOCAL: LOCAL === 'true',
    // Detects watch mode when running `npm run start:dev`
    WATCH_MODE: npm_lifecycle_script?.includes('--watch') ?? false,
    LOG_LEVEL,
    DATABASE_HOST,
    DATABASE_PORT: int(DATABASE_PORT),
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME,
    REDIS_HOST,
    REDIS_PORT: int(REDIS_PORT),
    REDIS_USER,
    REDIS_PASS,
    PUBLIC_HOST,
    UA_STRING,
    SESSION_SECRET_KEY_PATH,
    SESSION_COOKIE_SECURE: bool(SESSION_COOKIE_SECURE),
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_CLIENT_SCOPES,
    DISCORD_BOT_TOKEN,
    DISCORD_BOT_ENABLED: bool(DISCORD_BOT_ENABLED),
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
