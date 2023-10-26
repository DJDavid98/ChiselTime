import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import type { DiscordUser } from '../../discord-users/entities/discord-user.entity';
import { KnownSettings } from '../model/known-settings.enum';
import { ColumnOptions } from '../model/column-options.enum';
import { FormatOptions } from '../model/format-options.model';

export interface SettingTypes {
  [KnownSettings.timezone]: string;
  [KnownSettings.ephemeral]: boolean;
  [KnownSettings.header]: boolean;
  [KnownSettings.columns]: ColumnOptions;
  [KnownSettings.format]: FormatOptions;
}

export const settingsPrimitiveTypes: Record<
  KnownSettings,
  'string' | 'boolean'
> = {
  [KnownSettings.timezone]: 'string',
  [KnownSettings.ephemeral]: 'boolean',
  [KnownSettings.header]: 'boolean',
  [KnownSettings.columns]: 'string',
  [KnownSettings.format]: 'string',
};

export const USER_SETTINGS_SETTING_MAX_LENGTH = 64;

@Entity('user_settings')
export class UserSetting<Setting extends string = string> {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @ManyToOne('DiscordUser', (user: DiscordUser) => user.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  user: Promise<DiscordUser> | DiscordUser;

  @Column('character varying', {
    length: USER_SETTINGS_SETTING_MAX_LENGTH,
    nullable: false,
  })
  setting: Setting;

  @Column('json', { nullable: false })
  value: string;

  static getDecodedValue<
    Setting extends keyof typeof settingsPrimitiveTypes & string,
  >(setting: UserSetting<Setting>): SettingTypes[Setting] | null {
    const parsedValue = JSON.parse(setting.value);
    if (typeof parsedValue === settingsPrimitiveTypes[setting.setting]) {
      return parsedValue as never;
    }

    return null;
  }
}
