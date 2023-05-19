import {
  getNextOccurrence,
  parseRecurringInterval,
  replaceIntervalsInString,
} from './interval-parsing';
import { Temporal } from '@js-temporal/polyfill';

describe('Interval parsing', () => {
  const timezone = 'Europe/Budapest';

  describe('parseInterval', () => {
    it('should process the interval with all components correctly', () => {
      const now = Temporal.Now.zonedDateTimeISO(timezone);
      const nowIsoString = new Date(now.epochMilliseconds).toISOString();
      const input = `R--${nowIsoString}[${timezone}]--P1Y1M1W1DT1H1M1S`;
      const actual = parseRecurringInterval(input);
      const expected = {
        startDate: now,
        duration: new Temporal.Duration(1, 1, 1, 1, 1, 1, 1),
      };
      expect(actual).toEqual(expected);
    });

    it('should fail on too short input', () => {
      const tooShortInput = ['R--', 'R--', 'R--AWOO'];
      tooShortInput.forEach((input) => {
        expect(() => parseRecurringInterval(input)).toThrow(
          `Invalid time interval string ${input}`,
        );
      });
    });

    it('should fail on malformed input', () => {
      expect(() =>
        parseRecurringInterval('R--2023-03-06T00:00:00Z--P1D'),
      ).toThrow(`Temporal.ZonedDateTime requires a time zone ID in brackets`);

      const malformedIsoString = '2023-69-42T90:00:00Z[GMT]';
      expect(() =>
        parseRecurringInterval(`R--${malformedIsoString}--P1D`),
      ).toThrow(`invalid ISO 8601 string: ${malformedIsoString}`);

      const malformedDurationString = 'PD1';
      expect(() =>
        parseRecurringInterval(
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
      const actual = getNextOccurrence(
        {
          startDate: now,
          duration: Temporal.Duration.from({ weeks: 1 }),
        },
        now,
      );
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
      const actual = getNextOccurrence(
        {
          startDate,
          duration: Temporal.Duration.from({ weeks: 1 }),
        },
        now,
      );
      expect(actual).toEqual(expected);
    });
  });

  describe('replaceIntervalsInString', () => {
    it('should replace special time interval markers in text', () => {
      const now = Temporal.ZonedDateTime.from(
        `2023-05-10T00:00:00Z[${timezone}]`,
      );
      const expected = `The meeting is held weekly, the next occasion will be: <t:1683903600:F>`;
      const actual = replaceIntervalsInString(
        `The meeting is held weekly, the next occasion will be: <ct:F:R--2023-05-05T15:00:00Z[GMT]--P1W>`,
        now,
      );
      expect(actual).toEqual(expected);
    });
  });
});
