import { findDateConstraint } from './find-date-constraint';
import { DateConstraint } from './date-constraint';

describe('findDateConstraint', () => {
  it('should process full dates', () => {
    const input = '2023-07-22';
    const actual = findDateConstraint(input);
    const expected = new DateConstraint(2023, 7, 22);
    expect(actual).toEqual(expected);
  });

  it('should process individual parts', () => {
    const input = 'july 22nd 2023';
    const actual = findDateConstraint(input);
    const expected = new DateConstraint(2023, 7, 22);
    expect(actual).toEqual(expected);
  });

  it('should process year only', () => {
    const input = 'in 2023';
    const actual = findDateConstraint(input);
    const expected = new DateConstraint(2023, undefined, undefined);
    expect(actual).toEqual(expected);
  });

  it('should process month only', () => {
    const input = 'in july';
    const actual = findDateConstraint(input);
    const expected = new DateConstraint(undefined, 7, undefined);
    expect(actual).toEqual(expected);
  });

  it('should process date only', () => {
    const input = 'on the 22nd';
    const actual = findDateConstraint(input);
    const expected = new DateConstraint(undefined, undefined, 22);
    expect(actual).toEqual(expected);
  });

  it('should return undefined when no constraint is found', () => {
    const actual = findDateConstraint('test');
    expect(actual).toBeUndefined();
  });
});
