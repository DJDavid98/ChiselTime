import { Temporal } from '@js-temporal/polyfill';

export interface DateTimeConstraint {
  constrain(
    time: Temporal.ZonedDateTime,
    inputNow?: Temporal.ZonedDateTime,
  ): Temporal.ZonedDateTime;
}
