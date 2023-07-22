import { Temporal } from '@js-temporal/polyfill';
import { NextOccurrenceGetter } from './next-occurrence-getter';
import { RecurringInterval } from './recurring-interval';
import { FreeformInterval } from './freeeform/freeform-interval';

export const replaceIntervalsInString = (
  input: string,
  timezone: string,
  inputNow?: Temporal.ZonedDateTime,
) => {
  const intervalCache: Record<string, NextOccurrenceGetter> = {};
  const getCachedInterval = (lookupInterval: string): NextOccurrenceGetter => {
    if (!(lookupInterval in intervalCache)) {
      if (/^R(?:\d+)?(?:--|\/)/.test(lookupInterval)) {
        intervalCache[lookupInterval] = RecurringInterval.parse(lookupInterval);
      } else {
        intervalCache[lookupInterval] = FreeformInterval.parse(
          lookupInterval,
          timezone,
        );
      }
    }

    return intervalCache[lookupInterval];
  };
  return input.replace(
    /<ct:([dftDFRT]):([^>]+)>/g,
    (substring, format, intervalInput) => {
      try {
        const interval = getCachedInterval(intervalInput);
        const nextOccurrence = interval.getNextOccurrence(inputNow);
        return `<t:${nextOccurrence.epochSeconds}:${format}>`;
      } catch (e) {
        console.error(e);
      }
      return substring;
    },
  );
};
