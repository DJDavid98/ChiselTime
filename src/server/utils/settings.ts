import { UserSetting } from '../user-settings/entities/user-setting.entity';
import { DiscordUsersService } from '../discord-users/discord-users.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { KnownSettings } from '../user-settings/model/known-settings.enum';

export const updateSetting = async <Setting extends KnownSettings>(
  discordUsersService: DiscordUsersService,
  userSettingsService: UserSettingsService,
  userId: string,
  setting: Setting,
  value: unknown,
) => {
  const discordUser = await discordUsersService.findOne(userId);
  if (!discordUser) {
    return {
      content: 'Could not find Discord user in the database',
      ephemeral: true,
    };
  }

  let settingRecord: UserSetting;
  try {
    settingRecord = await userSettingsService.setSetting(
      discordUser,
      setting,
      value,
    );
  } catch (e) {
    console.error(e);
    return {
      content: `Could not update setting: ${e.message}`,
      ephemeral: true,
    };
  }

  return {
    content: `Setting \`${setting}\` updated to \`${settingRecord.value.replace(
      /`/,
      '\\`',
    )}\` successfully`,
    ephemeral: true,
  };
};
