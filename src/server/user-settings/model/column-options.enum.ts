export const ColumnOptions = {
  syntax: 'syntax',
  preview: 'preview',
  both: 'both',
} as const;
export type ColumnOptions = (typeof ColumnOptions)[keyof typeof ColumnOptions];
