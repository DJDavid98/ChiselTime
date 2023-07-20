import { Choice, Param, ParamType } from '@discord-nestjs/core';
import {
  KnownSettings,
  USER_SETTINGS_SETTING_MAX_LENGTH,
} from '../../user-settings/entities/user-setting.entity';

export class SetSettingDto {
  @Choice(KnownSettings)
  @Param({
    name: 'setting',
    type: ParamType.STRING,
    description: 'Name of the setting to change',
    maxLength: USER_SETTINGS_SETTING_MAX_LENGTH,
    required: true,
    // TODO Change to true and handle autocompletion
    autocomplete: false,
  })
  setting: string;

  @Param({ description: 'value', type: ParamType.STRING })
  value: string;
}
