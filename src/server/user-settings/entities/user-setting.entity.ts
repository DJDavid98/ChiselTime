import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
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
  @JoinColumn({ name: 'discord_user_id' })
  user: Promise<DiscordUser> | DiscordUser;

  @Column('character varying', {
    length: USER_SETTINGS_SETTING_MAX_LENGTH,
    nullable: false,
  })
  setting: Setting;

  @Column('json', { nullable: false })
  value: unknown;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  static getDecodedValue<
    Setting extends keyof typeof settingsPrimitiveTypes & string,
  >(setting: UserSetting<Setting>): SettingTypes[Setting] | null {
    if (typeof setting.value === settingsPrimitiveTypes[setting.setting]) {
      return setting.value as never;
    }

    return null;
  }
}
