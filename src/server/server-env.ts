import { config } from 'dotenv';

config();

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
} = process.env;

/**
 * Type-safe process.env
 */
export const serverEnv = (() => {
  const values = {
    DATABASE_HOST,
    DATABASE_PORT: DATABASE_PORT && parseInt(DATABASE_PORT),
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME,
  };

  type Values = typeof values;

  Object.keys(values).forEach((key) => {
    if (typeof values[key as keyof Values] !== 'undefined') return;

    throw new Error(`${key} server environment variable not set`);
  });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
