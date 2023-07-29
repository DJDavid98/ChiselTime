import { Temporal } from '@js-temporal/polyfill';

export const isValidTimeZone = (tz: unknown): boolean => {
  try {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
      return false;
    }

    if (typeof tz !== 'string') {
      return false;
    }

    // throws an error if timezone is not valid
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidUpdateFrequency = (frequency: unknown): boolean => {
  if (typeof frequency !== 'string') {
    return false;
  }
  try {
    const duration = Temporal.Duration.from(frequency);
    return !duration.blank;
  } catch (e) {
    console.error(e);
    return false;
  }
};
