import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';
import { Command, Handler } from '@discord-nestjs/core';
import { replaceIntervalsInString } from '../../utils/interval-parsing/replace-intervals-in-string';
import { MessageTemplatesService } from '../../message-templates/message-templates.service';
import { DiscordUsersService } from '../../discord-users/discord-users.service';
import { getReadableInterval } from '../../../client/utils/get-readable-interval';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { fallbackTimezone } from '../../common/time';
import { Emoji } from '../../common/emoji';
import { ensureDiscordUser, resolveUserTimezone } from '../utils/permissions';
import { UserFacingError } from '../utils/user-facing-error.class';

@Command({
  name: 'Create Template',
  type: ApplicationCommandType.Message,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
})
export class CreateTemplateCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly messageTemplatesService: MessageTemplatesService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Handler()
  async handler(
    interaction: MessageContextMenuCommandInteraction,
  ): Promise<void> {
    const message = interaction.targetMessage;
    const interactionChannel = interaction.channel;
    if (!interactionChannel) {
      await interaction.reply({
        content: 'This command can only be used in channels',
        ephemeral: true,
      });
      return;
    }
    if (!(interactionChannel instanceof TextChannel)) {
      await interaction.reply({
        content: 'Template messages can only be created in text channels',
        ephemeral: true,
      });
      return;
    }

    try {
      const discordUser = await ensureDiscordUser(
        this.discordUsersService,
        interaction.user.id,
      );

      const userTemplates = await this.messageTemplatesService.findAll({
        discordUserIds: [discordUser.id],
      });
      const localUser = await discordUser.user;
      const maxTemplateCount = localUser.getMaxTemplateCount();
      if (userTemplates.length >= maxTemplateCount) {
        await interaction.reply({
          content: [
            `You have reached the maximum number of templates (${maxTemplateCount}) for your account, delete existing templates to create a new one:`,
            ...userTemplates.map(
              (template) =>
                `• ${template.getMessageUrl()} (\`${template.id}\`)`,
            ),
          ].join('\n'),
          ephemeral: true,
        });
        return;
      }

      const existingTemplate = await this.messageTemplatesService.findExisting(
        message.channelId,
        message.id,
      );
      if (existingTemplate) {
        await interaction.reply({
          content: [
            `Template already exists with ID \`${existingTemplate.id}\``,
            `Message link: ${existingTemplate.getMessageUrl()}`,
          ].join('\n'),
          ephemeral: true,
        });
        return;
      }

      const templateContent = message.content;
      const timezone = await resolveUserTimezone(
        this.userSettingsService,
        interaction,
      );
      const effectiveTimezone = timezone || fallbackTimezone;
      const channelMessage = await interactionChannel.send({
        content: replaceIntervalsInString(templateContent, effectiveTimezone),
      });

      const templateMessage = await this.messageTemplatesService.create({
        author: discordUser,
        body: templateContent,
        updateFrequency: 'P1D',
        serverId: channelMessage.guildId,
        channelId: channelMessage.channelId,
        messageId: channelMessage.id,
        timezone,
      });

      const readableUpdateFrequency = getReadableInterval(
        templateMessage.updateFrequency,
      );
      await interaction.reply({
        content: [
          `${Emoji.CHECK_MARK_BUTTON} Template \`${
            templateMessage.id
          }\` created successfully${
            timezone ? ` with the timezone \`${effectiveTimezone}\`` : ''
          }. The message will update ${readableUpdateFrequency}`,
        ].join('\n'),
        ephemeral: true,
      });
    } catch (e) {
      if (e instanceof UserFacingError) {
        await interaction.reply({
          content: e.message,
          ephemeral: true,
        });
        return;
      }
      throw e;
    }
  }
}
