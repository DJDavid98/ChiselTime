import { WeekdayConstraint } from './weekday-constraint';
import { Temporal } from '@js-temporal/polyfill';

describe('Weekday Constraint', () => {
  const timezone = 'Europe/Budapest';

  it('should not change the input in case the weekday matches', () => {
    const now = Temporal.Now.zonedDateTimeISO(timezone);
    const constraint = new WeekdayConstraint(now.dayOfWeek);
    const result = constraint.constrain(now);
    expect(result.dayOfWeek).toEqual(now.dayOfWeek);
  });

  it('should change to next weekday when constraint is in past', () => {
    const saturdayDate = Temporal.ZonedDateTime.from(`2023-07-22[${timezone}]`);
    const weekdayMonday = 1;
    const constraint = new WeekdayConstraint(weekdayMonday);
    const result = constraint.constrain(saturdayDate);
    expect(result.toPlainDate().toString()).toEqual('2023-07-24');
    expect(result.weekOfYear).toEqual(saturdayDate.weekOfYear + 1);
    expect(result.dayOfWeek).toEqual(weekdayMonday);
  });

  it('should change to current weekday when constraint is in past', () => {
    const thursdayDate = Temporal.ZonedDateTime.from(`2023-07-20[${timezone}]`);
    const weekdaySaturday = 6;
    const constraint = new WeekdayConstraint(weekdaySaturday);
    const result = constraint.constrain(thursdayDate);
    expect(result.toPlainDate().toString()).toEqual('2023-07-22');
    expect(result.weekOfYear).toEqual(thursdayDate.weekOfYear);
    expect(result.dayOfWeek).toEqual(weekdaySaturday);
  });
});
