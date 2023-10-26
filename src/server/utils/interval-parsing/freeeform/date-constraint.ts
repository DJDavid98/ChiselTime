import { DateTimeConstraint } from './date-time-constraint';
import { Temporal } from '@js-temporal/polyfill';
import { applyConstraint } from './apply-constraint';

export class DateConstraint implements DateTimeConstraint {
  constructor(
    public readonly year?: number,
    public readonly month?: number,
    public readonly day?: number,
  ) {}

  constrain(time: Temporal.ZonedDateTime): Temporal.ZonedDateTime {
    const fields: Temporal.ZonedDateTimeLike = {
      timeZone: time.timeZoneId,
      year: time.year,
      month: time.month,
      day: time.day,
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      millisecond: time.millisecond,
      microsecond: time.microsecond,
    };
    applyConstraint(fields, 'year', this.year);
    applyConstraint(fields, 'month', this.month);
    applyConstraint(fields, 'day', this.day);
    return Temporal.ZonedDateTime.from(fields);
  }
}
