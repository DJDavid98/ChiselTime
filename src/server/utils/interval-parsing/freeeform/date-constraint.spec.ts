import { Temporal } from '@js-temporal/polyfill';
import { DateConstraint } from './date-constraint';

describe('Date Constraint', () => {
  const timezone = 'Europe/Budapest';
  const now = Temporal.ZonedDateTime.from(`2023-07-22T00:00:00[${timezone}]`);

  it('should change the years', () => {
    const year = 2025;
    const constraint = new DateConstraint(year);
    const result = constraint.constrain(now);
    expect(result.toPlainDate().toString()).toEqual(`${year}-07-22`);
    expect(result.year).toEqual(year);
  });

  it('should change the month', () => {
    const month = 10;
    const constraint = new DateConstraint(undefined, month);
    const result = constraint.constrain(now);
    expect(result.toPlainDate().toString()).toEqual(`2023-${month}-22`);
    expect(result.month).toEqual(month);
  });

  it('should change the day', () => {
    const day = 15;
    const constraint = new DateConstraint(undefined, undefined, day);
    const result = constraint.constrain(now);
    expect(result.toPlainDate().toString()).toEqual(`2023-07-${day}`);
    expect(result.day).toEqual(day);
  });
});
