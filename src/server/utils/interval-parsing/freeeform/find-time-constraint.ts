import { TimeConstraint } from './time-constraint';

export function findTimeConstraint(input: string): TimeConstraint | undefined {
  const result = input.match(
    /(?:^|\b)(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?(?: ?([ap]m))?(?:\b|$)/,
  );
  if (result) {
    const [, hours, minutes, seconds, ampm] = result;
    if (!hours) {
      // Theoretically impossible due to the regex requiring the hours component
      return undefined;
    }
    let hoursConstraint = parseInt(hours, 10);
    if (ampm) {
      const baseValue = hoursConstraint % 12;
      hoursConstraint = ampm === 'pm' ? 12 + baseValue : baseValue;
    }

    const minutesConstraint = minutes ? parseInt(minutes) : 0;
    const secondsConstraint = seconds ? parseInt(seconds) : 0;

    return new TimeConstraint(
      hoursConstraint,
      minutesConstraint,
      secondsConstraint,
    );
  }
}
