import { Temporal } from '@js-temporal/polyfill';

const readableDurationKeys = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
] as const;

export const getReadableInterval = (interval: string) => {
  const duration = Temporal.Duration.from(interval);
  return (
    'every ' +
    readableDurationKeys
      .reduce((parts, unit) => {
        const value = duration[unit];
        if (value > 0)
          return [
            ...parts,
            `${value} ${value !== 1 ? unit : unit.replace(/s$/, '')}`,
          ];

        return parts;
      }, [] as string[])
      .join(', ')
      .replace(/, ([^,]+)$/, ' and $1')
  );
};
