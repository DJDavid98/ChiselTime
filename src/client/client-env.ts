import { config } from 'dotenv';
import * as process from 'process';
import { join } from 'path';
import { existsSync } from 'fs';

const cwd = process.cwd();
const envFilePath = [join(cwd, '.env'), join(cwd, '..', '..', '.env')].find(
  (path) => existsSync(path),
);
config({ path: envFilePath });
if (!envFilePath) {
  console.error('Could not find environment variable file');
  process.exit(1);
}

const { PUBLIC_HOST, DISCORD_CLIENT_ID, DISCORD_CLIENT_SCOPES } = process.env;

/**
 * Type-safe process.env
 */
export const clientEnv = (() => {
  const values = {
    PUBLIC_HOST,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SCOPES,
  };

  type Values = typeof values;

  Object.keys(values).forEach((key) => {
    if (typeof values[key as keyof Values] !== 'undefined') return;

    throw new Error(`${key} client environment variable not set`);
  });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
