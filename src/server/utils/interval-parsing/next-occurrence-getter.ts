import { Temporal } from '@js-temporal/polyfill';

export interface NextOccurrenceGetter {
  getNextOccurrence(inputNow?: Temporal.ZonedDateTime): Temporal.ZonedDateTime;
}
