import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import type { DiscordUser } from '../../discord-users/entities/discord-user.entity';
import { isValidTimeZone } from '../../utils/timezone';

export const KnownSettings = {
  timezone: 'timezone',
  ephemeral: 'ephemeral',
} as const;
export type KnownSettings = (typeof KnownSettings)[keyof typeof KnownSettings];

export interface SettingTypes {
  [KnownSettings.timezone]: string;
  [KnownSettings.ephemeral]: boolean;
}

export const settingsTypeGuards: {
  [k in KnownSettings]: (value: unknown) => value is SettingTypes[k];
} = {
  [KnownSettings.timezone]: (value): value is string =>
    typeof value === 'string',
  [KnownSettings.ephemeral]: (value): value is boolean =>
    typeof value === 'boolean',
};

export const settingsParser: {
  [k in KnownSettings]: (value: unknown) => SettingTypes[k] | null;
} = {
  [KnownSettings.timezone]: (value) =>
    typeof value === 'string' && isValidTimeZone(value) ? value : null,
  [KnownSettings.ephemeral]: (value) =>
    typeof value === 'boolean' ? value : null,
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
    Setting extends keyof typeof settingsTypeGuards & string,
  >(setting: UserSetting<Setting>): SettingTypes[Setting] | null {
    const parsedValue = JSON.parse(setting.value);
    if (settingsTypeGuards[setting.setting](parsedValue)) {
      return parsedValue as never;
    }

    return null;
  }
}
