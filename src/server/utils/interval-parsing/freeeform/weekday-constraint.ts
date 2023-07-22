import { DateTimeConstraint } from './date-time-constraint';
import { Temporal } from '@js-temporal/polyfill';

export class WeekdayConstraint implements DateTimeConstraint {
  constructor(public readonly weekday: number) {}

  constrain(time: Temporal.ZonedDateTime): Temporal.ZonedDateTime {
    let value = Temporal.ZonedDateTime.from(time);
    if (value.dayOfWeek !== this.weekday) {
      if (this.weekday < value.dayOfWeek) {
        const addDays = value.daysInWeek - (value.dayOfWeek - this.weekday);
        value = value.add(Temporal.Duration.from({ days: addDays }));
      } else {
        const addDays = this.weekday - value.dayOfWeek;
        value = value.add(Temporal.Duration.from({ days: addDays }));
      }
    }
    return value;
  }
}
