import { Param, ParamType } from '@discord-nestjs/core';

export class SetTimezoneDto {
  @Param({
    name: 'value',
    description: 'The IANA timezone identifier',
    type: ParamType.STRING,
    // TODO Figure this out later
    // autocomplete: true,
    required: true,
  })
  value: string;
}
