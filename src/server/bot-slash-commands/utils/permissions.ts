import { MessageTemplate } from '../../message-templates/entities/message-template.entity';
import { UserFacingError } from './user-facing-error.class';
import { DiscordUsersService } from '../../discord-users/discord-users.service';
import { DiscordUser } from '../../discord-users/entities/discord-user.entity';
import { MessageTemplatesService } from '../../message-templates/message-templates.service';
import { KnownSettings } from '../../user-settings/model/known-settings.enum';
import { UserSetting } from '../../user-settings/entities/user-setting.entity';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { Interaction, TextChannel } from 'discord.js';

export const ensureTemplateOwner = <
  Interaction extends { user: { id: string } },
>(
  template: MessageTemplate,
  interaction: Interaction,
  action: string,
): void => {
  if (template.author.id !== interaction.user.id) {
    throw new UserFacingError(
      `Only the creator of this template can ${action} it.`,
    );
  }
};

export const ensureDiscordUser = async (
  discordUsersService: DiscordUsersService,
  discordUserId: string,
): Promise<DiscordUser> => {
  const discordUser = await discordUsersService.findOne(discordUserId);
  if (!discordUser) {
    throw new UserFacingError('Could not find Discord user in the database');
  }
  return discordUser;
};

export const ensureTemplate = async (
  messageTemplatesService: MessageTemplatesService,
  entityId: string,
): Promise<MessageTemplate> => {
  const existingTemplate = await messageTemplatesService.findOne(entityId);
  if (!existingTemplate) {
    throw new UserFacingError('The template does not exist');
  }
  return existingTemplate;
};

export const resolveUserTimezone = async <
  Interaction extends { user: { id: string } },
>(
  userSettingsService: UserSettingsService,
  interaction: Interaction,
): Promise<string | undefined> => {
  const timezoneSetting = await userSettingsService.getSetting(
    interaction.user.id,
    KnownSettings.timezone,
  );
  return (
    (timezoneSetting && UserSetting.getDecodedValue(timezoneSetting)) ??
    undefined
  );
};

export const ensureTextChannel = (
  interaction: Interaction,
  channelId: string,
): TextChannel => {
  const channel = interaction.client.channels.cache.get(channelId);
  if (!(channel instanceof TextChannel)) {
    throw new UserFacingError('Template message points to non-text channel');
  }
  return channel;
};
