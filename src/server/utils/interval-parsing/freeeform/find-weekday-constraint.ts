import { WeekdayConstraint } from './weekday-constraint';

const weekdayValues: Record<string, number> = {
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  wensday: 3,
  thu: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
  sun: 7,
  sunday: 7,
};
const weekdayRegex = new RegExp(
  `(?:^|\\b)(${Object.keys(weekdayValues).join('|')})(?:\\b|$)`,
);

export function findWeekdayConstraint(
  input: string,
): WeekdayConstraint | undefined {
  const result = input.match(weekdayRegex);
  if (result) {
    const weekdayConstraint: number | undefined = weekdayValues[result[1]];
    if (weekdayConstraint) {
      return new WeekdayConstraint(weekdayConstraint);
    }
  }
}
