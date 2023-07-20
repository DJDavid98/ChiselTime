import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  KnownSettings,
  settingsParser,
  settingsTypeGuards,
  SettingTypes,
  UserSetting,
} from './entities/user-setting.entity';
import { DiscordUser } from '../discord-users/entities/discord-user.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingsRepository: Repository<UserSetting>,
  ) {}

  async findAll(user: DiscordUser | string) {
    return await this.userSettingsRepository.findBy({
      user: { id: typeof user === 'string' ? user : user.id },
    });
  }

  async getSetting<Setting extends KnownSettings>(
    user: DiscordUser | string,
    setting: Setting,
  ): Promise<UserSetting<Setting> | null> {
    return (await this.userSettingsRepository.findOneBy({
      user: { id: typeof user === 'string' ? user : user.id },
      setting,
    })) as UserSetting<Setting> | null;
  }

  async getSettingValue<Setting extends KnownSettings>(
    user: DiscordUser | string,
    setting: Setting,
  ): Promise<SettingTypes[Setting] | null> {
    const record = await this.getSetting<Setting>(user, setting);

    return record ? UserSetting.getDecodedValue(record) : null;
  }

  async setSetting<Setting extends KnownSettings>(
    user: DiscordUser,
    setting: Setting,
    value: unknown,
  ): Promise<UserSetting<Setting>> {
    if (!(setting in settingsTypeGuards)) {
      throw new Error(`Unknown setting ${setting}`);
    }

    const parsedValue = settingsParser[setting](value);
    if (!settingsTypeGuards[setting](parsedValue)) {
      throw new Error(`Setting ${setting} value type mismatch`);
    }

    let record = await this.getSetting(user, setting);
    if (record) {
      if (parsedValue === null) {
        await this.userSettingsRepository.remove(record);
      } else {
        const storedValue = UserSetting.getDecodedValue(record);
        if (parsedValue !== storedValue) {
          record.value = JSON.stringify(parsedValue);
          await this.userSettingsRepository.save(record);
        }
      }
    } else {
      debugger;
      record = new UserSetting<Setting>();
      record.user = user;
      record.setting = setting;
      record.value = JSON.stringify(parsedValue);
      if (parsedValue !== null) {
        await this.userSettingsRepository.save(record);
      }
    }

    return record;
  }
}
