import { findTimeConstraint } from './find-time-constraint';
import { TimeConstraint } from './time-constraint';

describe('findTimeConstraint', () => {
  describe('full value', () => {
    const expectedAm = new TimeConstraint(5, 30, 45);
    const expectedPm = new TimeConstraint(17, 30, 45);
    describe('12h', () => {
      it('should process time before noon', () => {
        const input = 'at 5:30:45am';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 5:30:45pm';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
    describe('24h', () => {
      it('should process time before noon', () => {
        const input = 'at 5:30:45';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });

      it('should process time in the afternoon', () => {
        const input = 'at 17:30:45';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
  });

  describe('regular hours only', () => {
    const expectedAm = new TimeConstraint(5, 0, 0);
    const expectedPm = new TimeConstraint(17, 0, 0);
    describe('12h', () => {
      it('should process time in before noon', () => {
        const input = 'at 5am';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 5pm';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
    describe('24h', () => {
      it('should process time in before noon', () => {
        const input = 'at 5';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 17';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
  });

  describe('midnight and noon hours only', () => {
    const expectedAm = new TimeConstraint(0, 0, 0);
    const expectedPm = new TimeConstraint(12, 0, 0);
    describe('12h', () => {
      it('should process time in before noon', () => {
        const input = 'at 12am';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 12pm';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
    describe('24h', () => {
      it('should process time in before noon', () => {
        const input = 'at 0';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 12';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
  });

  describe('hours and minutes', () => {
    const expectedAm = new TimeConstraint(5, 30, 0);
    const expectedPm = new TimeConstraint(17, 30, 0);
    describe('12h', () => {
      it('should process time in before noon', () => {
        const input = 'at 5:30am';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 5:30pm';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
    describe('24h', () => {
      it('should process time in before noon', () => {
        const input = 'at 5:30';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedAm);
      });
      it('should process time in the afternoon', () => {
        const input = 'at 17:30';
        const actual = findTimeConstraint(input);
        expect(actual).toEqual(expectedPm);
      });
    });
  });

  it('should return undefined when no constraint is found', () => {
    const actual = findTimeConstraint('test');
    expect(actual).toBeUndefined();
  });
});
