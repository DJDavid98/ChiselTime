import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { ColumnOptions } from '../../user-settings/model/column-options.enum';

export const setColumnsDtoChoices: Record<string, ColumnOptions | 'default'> = {
  'both syntax and preview': ColumnOptions.both,
  'preview only': ColumnOptions.preview,
  'syntax only': ColumnOptions.syntax,
  default: 'default',
};

export class SetColumnsDto {
  @Param({
    name: 'value',
    description: 'Choose the default columns for all time command responses',
    type: ParamType.STRING,
    required: true,
  })
  @Choice(setColumnsDtoChoices)
  value: string;
}
