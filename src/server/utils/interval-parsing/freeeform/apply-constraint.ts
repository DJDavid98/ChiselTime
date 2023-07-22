import { Temporal } from '@js-temporal/polyfill';

export const applyConstraint = (
  input: Temporal.ZonedDateTimeLike,
  key: keyof {
    [k in keyof Temporal.ZonedDateTimeLike]: Temporal.ZonedDateTimeLike[k] extends number
      ? true
      : never;
  },
  value: number | undefined,
): void => {
  if (typeof value === 'number') {
    input[key] = value as never;
  }
};
