export const KnownSettings = {
  timezone: 'timezone',
  ephemeral: 'ephemeral',
  header: 'header',
  columns: 'columns',
  format: 'format',
} as const;
export type KnownSettings = (typeof KnownSettings)[keyof typeof KnownSettings];
