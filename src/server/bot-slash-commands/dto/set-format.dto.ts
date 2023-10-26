import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { FormatOptions } from '../../user-settings/model/format-options.model';

export const setFormatDtoChoices: Record<string, FormatOptions | 'default'> = {
  'short date': FormatOptions.d,
  'date and time': FormatOptions.f,
  'short time': FormatOptions.t,
  'long date': FormatOptions.D,
  'weekday, date and time': FormatOptions.F,
  relative: FormatOptions.R,
  'long time': FormatOptions.T,
  default: 'default',
};

export class SetFormatDto {
  @Param({
    name: 'value',
    description: 'Choose the default format for all time command responses',
    type: ParamType.STRING,
    required: true,
  })
  @Choice(setFormatDtoChoices)
  value: string;
}
