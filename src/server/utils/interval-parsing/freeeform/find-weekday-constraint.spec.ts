import { findWeekdayConstraint } from './find-weekday-constraint';
import { WeekdayConstraint } from './weekday-constraint';

describe('findWeekdayConstraint', () => {
  it('should process weekday by full name', () => {
    const input = 'monday';
    const actual = findWeekdayConstraint(input);
    const expected = new WeekdayConstraint(1);
    expect(actual).toEqual(expected);
  });

  it('should return undefined when no constraint is found', () => {
    const actual = findWeekdayConstraint('test');
    expect(actual).toBeUndefined();
  });
});
