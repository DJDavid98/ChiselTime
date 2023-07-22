import { NextOccurrenceGetter } from '../next-occurrence-getter';
import { Temporal } from '@js-temporal/polyfill';
import { DateTimeConstraint } from './date-time-constraint';
import { findTimeConstraint } from './find-time-constraint';
import { findDateConstraint } from './find-date-constraint';
import { findWeekdayConstraint } from './find-weekday-constraint';

interface FreeformIntervalOptions {
  constraints: Array<DateTimeConstraint | undefined>;
  timezone: string;
}

export class FreeformInterval implements NextOccurrenceGetter {
  private readonly constraints: DateTimeConstraint[];
  private readonly timezone: string;

  constructor(options: FreeformIntervalOptions) {
    this.constraints = options.constraints.filter(
      (constraint): constraint is DateTimeConstraint => Boolean(constraint),
    );
    this.timezone = options.timezone;
  }

  /**
   * Try to handle as many cases as possible to allow natural language to specify timestamps
   */
  static parse(rawInput: string, timezone: string): FreeformInterval {
    const input = rawInput.trim().toLowerCase().replace(/\s+/, ' ');
    const constraints: DateTimeConstraint[] = [];
    const dateConstraint = findDateConstraint(input);
    if (dateConstraint) {
      constraints.push(dateConstraint);
    }
    const weekdayConstraint = findWeekdayConstraint(input);
    if (weekdayConstraint) {
      constraints.push(weekdayConstraint);
    }
    const timeConstraint = findTimeConstraint(input);
    if (timeConstraint) {
      constraints.push(timeConstraint);
    }
    return new FreeformInterval({ constraints, timezone });
  }

  getNextOccurrence(inputNow?: Temporal.ZonedDateTime): Temporal.ZonedDateTime {
    const now =
      inputNow ?? Temporal.Now.instant().toZonedDateTimeISO(this.timezone);

    return this.constraints.reduce(
      (finalTime, constraint) => constraint.constrain(finalTime),
      now,
    );
  }
}
