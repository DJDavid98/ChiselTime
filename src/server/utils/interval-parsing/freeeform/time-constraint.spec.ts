import { Temporal } from '@js-temporal/polyfill';
import { TimeConstraint } from './time-constraint';

describe('Time Constraint', () => {
  const timezone = 'Europe/Budapest';
  const now = Temporal.ZonedDateTime.from(`2023-07-22T00:00:00[${timezone}]`);

  it('should change the hours', () => {
    const hours = 10;
    const constraint = new TimeConstraint(hours);
    const result = constraint.constrain(now);
    expect(result.toPlainDate()).toEqual(now.toPlainDate());
    expect(result.hour).toEqual(hours);
    expect(result.minute).toEqual(now.minute);
    expect(result.second).toEqual(now.second);
    expect(result.millisecond).toEqual(0);
    expect(result.microsecond).toEqual(0);
  });

  it('should change the minutes', () => {
    const minutes = 30;
    const constraint = new TimeConstraint(undefined, minutes);
    const result = constraint.constrain(now);
    expect(result.hour).toEqual(now.hour);
    expect(result.minute).toEqual(minutes);
    expect(result.second).toEqual(now.second);
    expect(result.millisecond).toEqual(0);
    expect(result.microsecond).toEqual(0);
  });

  it('should change the seconds', () => {
    const seconds = 45;
    const constraint = new TimeConstraint(undefined, undefined, seconds);
    const result = constraint.constrain(now);
    expect(result.hour).toEqual(now.hour);
    expect(result.minute).toEqual(now.minute);
    expect(result.second).toEqual(seconds);
    expect(result.millisecond).toEqual(0);
    expect(result.microsecond).toEqual(0);
  });
});
