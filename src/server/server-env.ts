import { config } from 'dotenv';
import * as process from 'process';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });

const {
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
  PUBLIC_HOST,
  UA_STRING,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_CLIENT_SCOPES,
  DISCORD_BOT_TOKEN,
} = process.env;

/**
 * Type-safe process.env
 */
export const serverEnv = (() => {
  const values = {
    PORT: PORT || 3000,
    DATABASE_HOST,
    DATABASE_PORT: DATABASE_PORT && parseInt(DATABASE_PORT),
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME,
    PUBLIC_HOST,
    UA_STRING,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_CLIENT_SCOPES,
    DISCORD_BOT_TOKEN,
  };

  type Values = typeof values;

  Object.keys(values).forEach((key) => {
    if (typeof values[key as keyof Values] !== 'undefined') return;

    throw new Error(`${key} server environment variable not set`);
  });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
