import { Temporal } from '@js-temporal/polyfill';
import { replaceIntervalsInString } from './replace-intervals-in-string';

describe('replaceIntervalsInString', () => {
  const timezone = 'Europe/Budapest';

  it('should replace special time interval markers in text', () => {
    const now = Temporal.ZonedDateTime.from(
      `2023-05-10T00:00:00Z[${timezone}]`,
    );
    const expected = `The meeting is held weekly, the next occasion will be: <t:1683903600:F>`;
    const actual = replaceIntervalsInString(
      `The meeting is held weekly, the next occasion will be: <ct:F:R/2023-05-05T15:00:00Z[GMT]/P1W>`,
      timezone,
      now,
    );
    expect(actual).toEqual(expected);
  });

  describe('natural language time markers', () => {
    it('should replace weekday + time in text', () => {
      const now = Temporal.ZonedDateTime.from(
        `2023-05-10T00:00:00Z[${timezone}]`,
      );
      const expected = `The stream schedule is:
- Monday 6:15 PM (<t:1684167300:R>)
- Wednesday 3 AM (<t:1683680400:R>)
- Saturday 11:30 AM (<t:1683970200:R>)
- Sunday 9 PM (<t:1684090800:R>)
See you there!`;
      const actual = replaceIntervalsInString(
        `The stream schedule is:
- Monday 6:15 PM (<ct:R:Mon 6:15 PM>)
- Wednesday 3 AM (<ct:R:Wed 3 AM>)
- Saturday 11:30 AM (<ct:R:Sat 11:30am>)
- Sunday 9 PM (<ct:R:Sun 9pm>)
See you there!`,
        timezone,
        now,
      );
      expect(actual).toEqual(expected);
    });
  });
});
