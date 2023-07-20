import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  KnownSettings,
  settingsTypeGuards,
  SettingTypes,
  UserSetting,
} from './entities/user-setting.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingsRepository: Repository<UserSetting>,
  ) {}

  async getSetting<Setting extends KnownSettings>(
    user: User | string,
    setting: Setting,
  ): Promise<UserSetting<Setting> | null> {
    return (await this.userSettingsRepository.findOneBy({
      user: { id: typeof user === 'string' ? user : user.id },
      setting,
    })) as UserSetting<Setting> | null;
  }

  async getSettingValue<Setting extends KnownSettings>(
    user: User | string,
    setting: Setting,
  ): Promise<SettingTypes[Setting] | null> {
    const record = await this.getSetting<Setting>(user, setting);

    return record ? UserSetting.getDecodedValue(record) : null;
  }

  async setSetting<Setting extends KnownSettings>(
    user: User,
    setting: Setting,
    value: unknown,
  ): Promise<UserSetting<Setting>> {
    if (!(setting in settingsTypeGuards)) {
      throw new Error(`Unknown setting ${setting}`);
    }

    if (!settingsTypeGuards[setting](value)) {
      throw new Error(`Setting ${setting} value type mismatch`);
    }

    let record = await this.getSetting(user, setting);
    if (record) {
      const storedValue = UserSetting.getDecodedValue(record);
      if (value !== storedValue) {
        record.value = JSON.stringify(value);
        await this.userSettingsRepository.save(record);
      }
    } else {
      record = new UserSetting<Setting>();
      record.user = Promise.resolve(user);
      record.setting = setting;
      record.value = value;
      await this.userSettingsRepository.save(record);
    }

    return record;
  }
}
