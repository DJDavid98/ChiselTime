import { Param, ParamType } from '@discord-nestjs/core';

export class SetHeaderDto {
  @Param({
    name: 'value',
    description:
      'When set to false, the header showing how the input was interpreted is hidden',
    type: ParamType.BOOLEAN,
    required: true,
  })
  value: boolean;
}
