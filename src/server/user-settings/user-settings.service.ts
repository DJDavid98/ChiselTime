import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  settingsPrimitiveTypes,
  SettingTypes,
  UserSetting,
} from './entities/user-setting.entity';
import { DiscordUser } from '../discord-users/entities/discord-user.entity';
import { KnownSettings } from './model/known-settings.enum';
import { settingsParser } from './utils/settings-parser';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);

  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingsRepository: Repository<UserSetting>,
    private readonly redisService: RedisService,
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

  protected getSettingsCacheKey(userId: string) {
    return `user-settings-${userId}`;
  }

  async setSetting<Setting extends KnownSettings>(
    discordUser: DiscordUser,
    setting: Setting,
    value: unknown,
  ): Promise<UserSetting<Setting> | null> {
    if (!(setting in settingsPrimitiveTypes)) {
      throw new Error(`Unknown setting ${setting}`);
    }

    const parsedValue = settingsParser[setting](value, this.logger);
    if (parsedValue !== null) {
      const expectedType = settingsPrimitiveTypes[setting];
      const actualType = typeof parsedValue;
      if (expectedType !== actualType) {
        throw new Error(
          `Setting ${setting} value type mismatch (expected ${expectedType}, got ${actualType})`,
        );
      }
    }

    let record = await this.getSetting(discordUser, setting);
    if (record) {
      if (parsedValue === null) {
        await this.userSettingsRepository.remove(record);
        record = null;
      } else {
        const storedValue = UserSetting.getDecodedValue(record);
        if (parsedValue !== storedValue) {
          record.value = parsedValue;
          await this.userSettingsRepository.save(record);
        }
      }
    } else if (parsedValue !== null) {
      record = new UserSetting<Setting>();
      record.user = discordUser;
      record.setting = setting;
      record.value = parsedValue;
      await this.userSettingsRepository.save(record);
    }

    const cacheKey = this.getSettingsCacheKey(discordUser.id);
    try {
      const count = await this.redisService.getClient().del(cacheKey);
      if (count > 0) {
        this.logger.debug(`Deleted cache key ${cacheKey} successfully`);
      } else {
        this.logger.debug(`Cache key ${cacheKey} not found`);
      }
    } catch (e) {
      this.logger.error(`Failed to delete cache key ${cacheKey}`);
      this.logger.error(e);
    }

    return record;
  }
}
