import { Temporal } from '@js-temporal/polyfill';
import { RecurringInterval } from './recurring-interval';

describe('Recurring Interval', () => {
  const timezone = 'Europe/Budapest';

  describe('parse', () => {
    it('should process the interval with all components correctly', () => {
      const now = Temporal.Now.zonedDateTimeISO(timezone);
      const nowIsoString = new Date(now.epochMilliseconds).toISOString();
      const input = `R--${nowIsoString}[${timezone}]--P1Y1M1W1DT1H1M1S`;
      const result = RecurringInterval.parse(input);
      expect(result.startDate).toEqual(now);
      expect(result.duration).toEqual(
        new Temporal.Duration(1, 1, 1, 1, 1, 1, 1),
      );
    });

    it('should fail on too short input', () => {
      const tooShortInput = ['R-', 'R--', 'R--AWOO', 'R/', 'R/AWR'];
      tooShortInput.forEach((input) => {
        expect(() => RecurringInterval.parse(input)).toThrow(
          `Invalid time interval string ${input}`,
        );
      });
    });

    it('should fail on malformed input', () => {
      expect(() =>
        RecurringInterval.parse('R--2023-03-06T00:00:00Z--P1D'),
      ).toThrow(`Temporal.ZonedDateTime requires a time zone ID in brackets`);

      const malformedIsoString = '2023-69-42T90:00:00Z[GMT]';
      expect(() =>
        RecurringInterval.parse(`R--${malformedIsoString}--P1D`),
      ).toThrow(`invalid ISO 8601 string: ${malformedIsoString}`);

      const malformedDurationString = 'PD1';
      expect(() =>
        RecurringInterval.parse(
          `R--2023-03-06T00:00:00Z[GMT]--${malformedDurationString}`,
        ),
      ).toThrow(`invalid duration: ${malformedDurationString}`);
    });
  });

  describe('getNextOccurrence', () => {
    it('should report the next occurrence correctly for weekly recurring event starting from now', () => {
      const now = Temporal.ZonedDateTime.from(
        `2023-05-06T00:00:00Z[${timezone}]`,
      );
      const expected = Temporal.ZonedDateTime.from(
        `2023-05-13T00:00:00Z[${timezone}]`,
      );
      const result = new RecurringInterval(
        now,
        Temporal.Duration.from({ weeks: 1 }),
      );
      const actual = result.getNextOccurrence(now);
      expect(actual).toEqual(expected);
    });

    it('should report the next occurrence correctly for weekly recurring event midway through the week', () => {
      const startDate = Temporal.ZonedDateTime.from(
        `2023-05-06T00:00:00Z[${timezone}]`,
      );
      const now = Temporal.ZonedDateTime.from(
        `2023-05-10T00:00:00Z[${timezone}]`,
      );
      const expected = Temporal.ZonedDateTime.from(
        `2023-05-13T00:00:00Z[${timezone}]`,
      );
      const result = new RecurringInterval(
        startDate,
        Temporal.Duration.from({ weeks: 1 }),
      );
      const actual = result.getNextOccurrence(now);
      expect(actual).toEqual(expected);
    });
  });
});
