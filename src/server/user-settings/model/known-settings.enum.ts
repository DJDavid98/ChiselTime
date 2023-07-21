export const KnownSettings = {
  timezone: 'timezone',
  ephemeral: 'ephemeral',
} as const;
export type KnownSettings = (typeof KnownSettings)[keyof typeof KnownSettings];
