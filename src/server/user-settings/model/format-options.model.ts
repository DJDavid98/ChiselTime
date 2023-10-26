export const FormatOptions = {
  d: 'd',
  f: 'f',
  t: 't',
  D: 'D',
  F: 'F',
  R: 'R',
  T: 'T',
} as const;
export type FormatOptions = (typeof FormatOptions)[keyof typeof FormatOptions];
