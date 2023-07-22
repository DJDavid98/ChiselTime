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

@Command({
  name: 'Delete Template',
  type: ApplicationCommandType.Message,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
})
export class DeleteTemplateCommand {
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

    const existingTemplate = await this.entityManager.findOne(MessageTemplate, {
      where: {
        channelId: message.channelId,
        messageId: message.id,
      },
    });
    if (!existingTemplate) {
      await interaction.reply({
        content: 'The selected message is not a template',
        ephemeral: true,
      });
      return;
    }
    const existingTemplateId = existingTemplate.id;

    if (existingTemplate.author.id !== discordUser.id) {
      await interaction.reply({
        content: 'Only the creator of this template can delete it',
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.client.channels.cache.get(
      existingTemplate.channelId,
    );
    if (!(channel instanceof TextChannel)) {
      await interaction.reply({
        content: 'Template message points to non-text channel',
        ephemeral: true,
      });
      return;
    }
    await channel.messages.delete(existingTemplate.messageId);
    await this.entityManager.remove(existingTemplate);

    await interaction.reply({
      content: `Template \`${existingTemplateId}\` successfully deleted`,
      ephemeral: true,
    });
  }
}
