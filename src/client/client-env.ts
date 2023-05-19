import { config } from 'dotenv';

config({ path: '../../.env' });

const { NEXT_PUBLIC_HOST } = process.env;

/**
 * Type-safe process.env
 */
export const clientEnv = (() => {
  const values = {
    NEXT_PUBLIC_HOST,
  };

  type Values = typeof values;

  Object.keys(values).forEach((key) => {
    if (typeof values[key as keyof Values] !== 'undefined') return;

    throw new Error(`${key} client environment variable not set`);
  });

  return values as { [Key in keyof Values]: Exclude<Values[Key], undefined> };
})();
