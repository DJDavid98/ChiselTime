import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import type { User } from '../../users/entities/user.entity';

export enum KnownSettings {
  timezone = 'timezone',
}

export interface SettingTypes {
  [KnownSettings.timezone]: string;
}

export const settingsTypeGuards: {
  [k in KnownSettings]: (value: unknown) => value is SettingTypes[k];
} = {
  [KnownSettings.timezone]: (value): value is string =>
    typeof value === 'string',
};

export const USER_SETTINGS_SETTING_MAX_LENGTH = 64;

@Entity('user_settings')
export class UserSetting<Setting extends string = string> {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @ManyToOne('User', (user: User) => user.settings)
  user: Promise<User>;

  @Column('character varying', { length: USER_SETTINGS_SETTING_MAX_LENGTH })
  setting: Setting;

  @Column('json')
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
