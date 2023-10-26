import { UserSetting } from '../user-settings/entities/user-setting.entity';
import { DiscordUsersService } from '../discord-users/discord-users.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { KnownSettings } from '../user-settings/model/known-settings.enum';
import { Emoji } from '../common/emoji';

export const updateSetting = async <Setting extends KnownSettings>(
  discordUsersService: DiscordUsersService,
  userSettingsService: UserSettingsService,
  userId: string,
  setting: Setting,
  value: unknown,
) => {
  let discordUser = await discordUsersService.findOne(userId);
  if (!discordUser) {
    discordUser = await discordUsersService.create({
      id: userId,
      name: 'Unknown User',
      avatar: null,
      displayName: null,
      discriminator: 0,
    });
  }

  let settingRecord: UserSetting | null;
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

  const outcome =
    settingRecord !== null
      ? `updated to \`${settingRecord.value.replace(/`/, '\\`')}\``
      : 'reset to default';

  return {
    content: `${Emoji.CHECK_MARK_BUTTON} Setting \`${setting}\` has been ${outcome} successfully`,
    ephemeral: true,
  };
};
