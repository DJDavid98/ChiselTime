import { Param, ParamType } from '@discord-nestjs/core';

export class SetEphemeralDto {
  @Param({
    name: 'value',
    description: 'When set to true, command responses are only visible to you',
    type: ParamType.BOOLEAN,
    required: true,
  })
  value: boolean;
}
