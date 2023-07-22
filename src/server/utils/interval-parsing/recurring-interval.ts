import { NextOccurrenceGetter } from './next-occurrence-getter';
import { Temporal } from '@js-temporal/polyfill';

export class RecurringInterval implements NextOccurrenceGetter {
  constructor(
    private startDateInput: Temporal.ZonedDateTime,
    private durationInput: Temporal.Duration,
  ) {}

  get startDate() {
    return this.startDateInput;
  }

  get duration() {
    return this.durationInput;
  }

  static parse(interval: string): RecurringInterval {
    let strippedTimezone: string | undefined;
    const intervalWithoutTimezone = interval.replace(/\[([^\]]+)]/, (_, tz) => {
      strippedTimezone = tz;
      return '';
    });
    const parts = intervalWithoutTimezone.split(/--|\//g);
    if (!parts || parts.length !== 3)
      throw new Error(`Invalid time interval string ${interval}`);
    const [, startDate, duration] = parts;

    return new RecurringInterval(
      Temporal.ZonedDateTime.from(
        startDate + (strippedTimezone ? `[${strippedTimezone}]` : ''),
      ),
      Temporal.Duration.from(duration),
    );
  }

  getNextOccurrence(inputNow?: Temporal.ZonedDateTime): Temporal.ZonedDateTime {
    let targetDate = Temporal.ZonedDateTime.from(this.startDateInput);
    const now = inputNow ?? Temporal.Now.instant();
    while (targetDate.epochMilliseconds < now.epochMilliseconds) {
      targetDate = targetDate.add(this.durationInput);
    }
    return targetDate;
  }
}
