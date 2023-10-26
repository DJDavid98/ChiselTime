import { DateTimeConstraint } from './date-time-constraint';
import { Temporal } from '@js-temporal/polyfill';
import { applyConstraint } from './apply-constraint';

export class TimeConstraint implements DateTimeConstraint {
  constructor(
    public readonly hour?: number,
    public readonly minute?: number,
    public readonly second?: number,
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
    applyConstraint(fields, 'hour', this.hour);
    applyConstraint(fields, 'minute', this.minute);
    applyConstraint(fields, 'second', this.second);
    return Temporal.ZonedDateTime.from(fields);
  }
}
