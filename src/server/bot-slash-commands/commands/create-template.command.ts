import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';
import { Command, Handler } from '@discord-nestjs/core';
import { EntityManager } from 'typeorm';
import { DiscordUser } from '../../discord-users/entities/discord-user.entity';
import { MessageTemplate } from '../../message-templates/entities/message-template.entity';
import { replaceIntervalsInString } from '../../utils/interval-parsing';
import { CreateMessageTemplateDto } from '../../message-templates/dto/create-message-template.dto';

@Command({
  name: 'Create Template',
  type: ApplicationCommandType.Message,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
})
export class CreateTemplateCommand {
  constructor(private readonly entityManager: EntityManager) {}

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

    const discordUser = await this.entityManager.findOne(DiscordUser, {
      where: { id: interaction.user.id },
    });
    if (!discordUser) {
      await interaction.reply({
        content: 'Could not find Discord user in the database',
        ephemeral: true,
      });
      return;
    }

    const userTemplates = await this.entityManager.find(MessageTemplate, {
      where: { author: { id: discordUser.id } },
    });
    const maxTemplateCount = discordUser.user.getMaxTemplateCount();
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

    const existingTemplate = await this.entityManager.findOne(MessageTemplate, {
      where: {
        channelId: message.channelId,
        messageId: message.id,
      },
    });
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

    let templateMessage = this.entityManager.create<MessageTemplate>(
      MessageTemplate,
      {
        author: discordUser,
        body: templateContent,
        updateFrequency: 'P1M',
        serverId: channelMessage.guildId,
        channelId: channelMessage.channelId,
        messageId: channelMessage.id,
      } satisfies CreateMessageTemplateDto,
    );
    templateMessage = await this.entityManager.save(templateMessage);

    await interaction.reply({
      content: `Template \`${templateMessage.id}\` created successfully with an update frequency of \`${templateMessage.updateFrequency}\``,
      ephemeral: true,
    });
  }
}
