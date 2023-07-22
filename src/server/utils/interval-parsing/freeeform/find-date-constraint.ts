import { DateConstraint } from './date-constraint';

const monthValues: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  febr: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  agust: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};
const monthsRegex = new RegExp(
  `(?:^|\\b)(${Object.keys(monthValues).join('|')})(?:\\b|$)`,
);

export function findDateConstraint(input: string): DateConstraint | undefined {
  let yearConstraint: number | undefined;
  let monthConstraint: number | undefined;
  let dayConstraint: number | undefined;

  const fullDateMatch = input.match(
    /(?:^|\b)(\d{4,})-(\d{1,2})-(\d{1,2})(?:\b|$)/,
  );
  let hasConstraints = Boolean(fullDateMatch);
  if (fullDateMatch) {
    const [, year, month, day] = fullDateMatch;
    yearConstraint = parseInt(year, 10);
    monthConstraint = parseInt(month, 10);
    dayConstraint = parseInt(day, 10);
  } else {
    const yearMatch = input.match(/(?:^|\b)(\d{4,})(?:\b|$)/);
    if (yearMatch) {
      yearConstraint = parseInt(yearMatch[1], 10);
      hasConstraints = true;
    }
    const monthMatch = input.match(monthsRegex);
    if (monthMatch) {
      monthConstraint = monthValues[monthMatch[1]];
      hasConstraints = true;
    }
    const dayMatch = input.match(/(?:^|\b)(\d{1,2})(?:st|nd|rd|th)(?:\b|$)/);
    if (dayMatch) {
      dayConstraint = parseInt(dayMatch[1], 10);
      hasConstraints = true;
    }
  }
  return hasConstraints
    ? new DateConstraint(yearConstraint, monthConstraint, dayConstraint)
    : undefined;
}
