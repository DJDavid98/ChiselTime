import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';
import { Command, Handler } from '@discord-nestjs/core';
import { replaceIntervalsInString } from '../../utils/interval-parsing';
import { MessageTemplatesService } from '../../message-templates/message-templates.service';
import { DiscordUsersService } from '../../discord-users/discord-users.service';
import { getReadableInterval } from '../../../client/utils/get-readable-interval';

@Command({
  name: 'Create Template',
  type: ApplicationCommandType.Message,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
})
export class CreateTemplateCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly messageTemplatesService: MessageTemplatesService,
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

    const discordUser = await this.discordUsersService.findOne(
      interaction.user.id,
    );
    if (!discordUser) {
      await interaction.reply({
        content: 'Could not find Discord user in the database',
        ephemeral: true,
      });
      return;
    }

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
            (template) => `• ${template.getMessageUrl()} (\`${template.id}\`)`,
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
    const channelMessage = await interactionChannel.send({
      content: replaceIntervalsInString(message.content),
    });

    const templateMessage = await this.messageTemplatesService.create({
      author: discordUser,
      body: templateContent,
      updateFrequency: 'P1D',
      serverId: channelMessage.guildId,
      channelId: channelMessage.channelId,
      messageId: channelMessage.id,
    });

    const readableUpdateFrequency = getReadableInterval(
      templateMessage.updateFrequency,
    );
    await interaction.reply({
      content: [
        `Template \`${templateMessage.id}\` created successfully. The message will update ${readableUpdateFrequency}`,
      ].join('\n'),
      ephemeral: true,
    });
  }
}
