import {
  ActionRowBuilder,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  ModalBuilder,
  PermissionFlagsBits,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { Command, Handler } from '@discord-nestjs/core';
import { EntityManager } from 'typeorm';
import { KnownSettings } from '../../user-settings/model/known-settings.enum';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { UserSetting } from '../../user-settings/entities/user-setting.entity';
import {
  fallbackTimezone,
  timezoneColumnMaxLength,
  updateFrequencyColumnMaxLength,
} from '../../common/time';
import { MessageTemplatesService } from '../../message-templates/message-templates.service';
import { DiscordUsersService } from '../../discord-users/discord-users.service';
import {
  editTemplateModalIdPrefix,
  templateInputId,
  timezoneInputId,
  updateFrequencyInputId,
} from '../../common/modals';

@Command({
  name: 'Edit Template',
  type: ApplicationCommandType.Message,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
})
export class EditTemplateCommand {
  constructor(
    private readonly entityManager: EntityManager,
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

    const existingTemplate = await this.messageTemplatesService.findExisting(
      message.channelId,
      message.id,
    );
    if (!existingTemplate) {
      await interaction.reply({
        content: 'The selected message is not a template',
        ephemeral: true,
      });
      return;
    }

    if (existingTemplate.author.id !== discordUser.id) {
      await interaction.reply({
        content: 'Only the creator of this template can edit it',
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
    const timezoneSetting = await this.userSettingsService.getSetting(
      discordUser,
      KnownSettings.timezone,
    );
    const userTimezone =
      (timezoneSetting && UserSetting.getDecodedValue(timezoneSetting)) ??
      undefined;
    const effectiveTimezone = userTimezone || fallbackTimezone;

    const modalId = `${editTemplateModalIdPrefix}.${existingTemplate.id}`;
    const modal = new ModalBuilder()
      .setCustomId(modalId)
      .setTitle(`Edit Template`);

    const templateInput = new TextInputBuilder()
      .setCustomId(templateInputId)
      .setLabel('Template message')
      .setStyle(TextInputStyle.Paragraph)
      .setValue(existingTemplate.body)
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(4000);
    const templateActionRow = new ActionRowBuilder<TextInputBuilder>({
      components: [templateInput],
    });

    const timezoneInput = new TextInputBuilder()
      .setCustomId(timezoneInputId)
      .setLabel('Timezone')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(effectiveTimezone)
      .setRequired(false)
      .setMaxLength(timezoneColumnMaxLength);
    if (existingTemplate.timezone) {
      timezoneInput.setValue(existingTemplate.timezone);
    }
    const timezoneActionRow = new ActionRowBuilder<TextInputBuilder>({
      components: [timezoneInput],
    });

    const updateFrequencyInput = new TextInputBuilder()
      .setCustomId(updateFrequencyInputId)
      .setLabel('Update frequency')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(updateFrequencyColumnMaxLength)
      .setValue(existingTemplate.updateFrequency);
    const updateFrequencyActionRow = new ActionRowBuilder<TextInputBuilder>({
      components: [updateFrequencyInput],
    });

    modal.addComponents(
      templateActionRow,
      timezoneActionRow,
      updateFrequencyActionRow,
    );

    await interaction.showModal(modal);
  }
}
