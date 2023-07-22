import { TimeConstraint } from './time-constraint';

export function findTimeConstraint(input: string): TimeConstraint | undefined {
  const result = input.match(
    /(?:^|\b)(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?(?: ?([ap]m))?(?:\b|$)/,
  );
  if (result) {
    const [, hours, minutes, seconds, ampm] = result;
    let hoursConstraint: number | undefined = undefined;
    if (hours) {
      if (ampm) {
        const baseValue = parseInt(hours, 10) % 12;
        hoursConstraint = ampm === 'am' ? baseValue : 12 + baseValue;
      } else {
        hoursConstraint = parseInt(hours, 10);
      }
    }

    const minutesConstraint = minutes ? parseInt(minutes) : undefined;
    const secondsConstraint = seconds ? parseInt(seconds) : undefined;

    return new TimeConstraint(
      hoursConstraint,
      minutesConstraint,
      secondsConstraint,
    );
  }
}
