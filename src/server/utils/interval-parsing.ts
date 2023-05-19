import { Temporal } from '@js-temporal/polyfill';

interface RecurringInterval {
  startDate: Temporal.ZonedDateTime;
  duration: Temporal.Duration;
}

export const parseRecurringInterval = (interval: string): RecurringInterval => {
  const parts = interval.split('--');
  if (!parts || parts.length !== 3)
    throw new Error(`Invalid time interval string ${interval}`);
  const [, startDate, duration] = parts;

  return {
    startDate: Temporal.ZonedDateTime.from(startDate),
    duration: Temporal.Duration.from(duration),
  };
};

export const getNextOccurrence = (
  interval: RecurringInterval,
  inputNow?: Temporal.ZonedDateTime,
): Temporal.ZonedDateTime => {
  let targetDate = Temporal.ZonedDateTime.from(interval.startDate);
  const now = inputNow ?? Temporal.Now.instant();
  while (targetDate.epochMilliseconds < now.epochMilliseconds) {
    targetDate = targetDate.add(interval.duration);
  }
  return targetDate;
};

export const replaceIntervalsInString = (
  input: string,
  inputNow?: Temporal.ZonedDateTime,
) => {
  const intervalCache: Record<string, RecurringInterval> = {};
  const getCachedInterval = (lookupInterval: string): RecurringInterval => {
    if (!(lookupInterval in intervalCache)) {
      intervalCache[lookupInterval] = parseRecurringInterval(lookupInterval);
    }

    return intervalCache[lookupInterval];
  };
  return input.replace(
    /<ct:([dftDFRT]):(R(\d+)?--[^>]+)>/g,
    (substring, format, intervalInput) => {
      try {
        const interval = getCachedInterval(intervalInput);
        const nextOccurrence = getNextOccurrence(interval, inputNow);
        return `<t:${nextOccurrence.epochSeconds}:${format}>`;
      } catch (e) {
        console.error(e);
      }
      return substring;
    },
  );
};
