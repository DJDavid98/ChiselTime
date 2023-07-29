import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ClientEvents,
  Events,
  MessageContextMenuCommandInteraction,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { Command, EventParams, Handler, IA, On } from '@discord-nestjs/core';
import { EntityManager } from 'typeorm';
import { MessageTemplate } from '../../message-templates/entities/message-template.entity';
import { MessageActionRowComponentBuilder } from '@discordjs/builders';
import { Emoji } from '../../common/emoji';
import {
  deleteTemplateButtonIdPrefix,
  editTemplateButtonIdPrefix,
  editTemplateModalIdPrefix,
  templateInputId,
  timezoneInputId,
  updateFrequencyInputId,
  updateTemplateButtonIdPrefix,
} from '../../common/modals';
import { ModalFieldsTransformPipe } from '@discord-nestjs/common';
import { UseGuards } from '@nestjs/common';
import { TemplateEditDto } from '../dto/template-edit.dto';
import { IsModalInteractionGuard } from '../guards/is-modal-interaction.guard';
import { UpdateMessageTemplateDto } from '../../message-templates/dto/update-message-template.dto';
import { isValidTimeZone, isValidUpdateFrequency } from '../../utils/timezone';
import { getReadableInterval } from '../../../client/utils/get-readable-interval';
import { IsTemplateEditModalInteractionGuard } from '../guards/is-template-edit-modal-interaction.guard';
import { processCustomId } from '../../bot/utils/messaging';
import { MessageTemplatesService } from '../../message-templates/message-templates.service';
import { IsButtonInteractionGuard } from '../guards/is-button-interaction.guard';
import { IsTemplateEditButtonInteractionGuard } from '../guards/is-template-edit-button-interaction.guard';
import {
  fallbackTimezone,
  timezoneColumnMaxLength,
  updateFrequencyColumnMaxLength,
} from '../../common/time';
import { DiscordUsersService } from '../../discord-users/discord-users.service';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { MessageUpdatesService } from '../../message-updates/message-updates.service';
import {
  ensureTemplate,
  ensureTemplateOwner,
  ensureTextChannel,
  resolveUserTimezone,
} from '../utils/permissions';
import { UserFacingError } from '../utils/user-facing-error.class';
import { IsTemplateDeleteButtonInteractionGuard } from '../guards/is-template-delete-button-interaction.guard';
import { IsTemplateUpdateButtonInteractionGuard } from '../guards/is-template-update-button-interaction.guard';

@Command({
  name: 'Manage Template',
  type: ApplicationCommandType.Message,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
})
export class ManageTemplateCommand {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly messageTemplatesService: MessageTemplatesService,
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
    private readonly messageUpdatesService: MessageUpdatesService,
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

    try {
      ensureTemplateOwner(existingTemplate, interaction, 'manage');

      const editButton = new ButtonBuilder()
        .setCustomId(`${editTemplateButtonIdPrefix}.${existingTemplateId}`)
        .setEmoji(Emoji.PENCIL)
        .setStyle(ButtonStyle.Primary)
        .setLabel('Edit')
        .toJSON();
      const updateButton = new ButtonBuilder()
        .setCustomId(`${updateTemplateButtonIdPrefix}.${existingTemplateId}`)
        .setEmoji(Emoji.REPEAT_BUTTON)
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Update')
        .toJSON();
      const deleteButton = new ButtonBuilder()
        .setCustomId(`${deleteTemplateButtonIdPrefix}.${existingTemplateId}`)
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger)
        .toJSON();
      const componentsRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>({
          components: [editButton, updateButton, deleteButton],
        });

      await interaction.reply({
        content: `Template \`${existingTemplateId}\` found, please choose from the actions below:
* **${editButton.emoji?.name} ${editButton.label}** will open a modal which allows you to modify the template
* **${updateButton.emoji?.name} ${updateButton.label}** will force-update the message based on the current time
* **${deleteButton.label}** will irreversibly delete the template everywhere`,
        components: [componentsRow],
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

  @On(Events.InteractionCreate)
  @UseGuards(IsButtonInteractionGuard, IsTemplateUpdateButtonInteractionGuard)
  async onUpdateButton(
    @EventParams() eventArgs: ClientEvents[Events.InteractionCreate],
  ): Promise<void> {
    const [interaction] = eventArgs;
    if (!interaction.isButton()) return;

    const [, templateId] = processCustomId(interaction);
    try {
      const existingTemplate = await ensureTemplate(
        this.messageTemplatesService,
        templateId,
      );
      ensureTemplateOwner(existingTemplate, interaction, 'update');

      await this.messageUpdatesService.queueUpdate(existingTemplate.id);

      await interaction.reply({
        content: `${Emoji.REPEAT_BUTTON} Template \`${existingTemplate.id}\` update has been scheduled.
${Emoji.INFO_BUTTON} This is typically instantaneous, but it can take a few minutes in case the server is busy.`,
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

  @On(Events.InteractionCreate)
  @UseGuards(IsButtonInteractionGuard, IsTemplateDeleteButtonInteractionGuard)
  async onDeleteButton(
    @EventParams() eventArgs: ClientEvents[Events.InteractionCreate],
  ): Promise<void> {
    const [interaction] = eventArgs;
    if (!interaction.isButton()) return;

    const [, templateId] = processCustomId(interaction);
    try {
      const existingTemplate = await ensureTemplate(
        this.messageTemplatesService,
        templateId,
      );
      const existingTemplateId = existingTemplate.id;
      ensureTemplateOwner(existingTemplate, interaction, 'delete');

      const channel = ensureTextChannel(
        interaction,
        existingTemplate.channelId,
      );
      await channel.messages.delete(existingTemplate.messageId);
      await this.entityManager.remove(existingTemplate);

      await interaction.reply({
        content: `${Emoji.CHECK_MARK_BUTTON} Template \`${existingTemplateId}\` successfully deleted.`,
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

  @On(Events.InteractionCreate)
  @UseGuards(IsButtonInteractionGuard, IsTemplateEditButtonInteractionGuard)
  async onEditButton(
    @EventParams() eventArgs: ClientEvents[Events.InteractionCreate],
  ): Promise<void> {
    const [interaction] = eventArgs;
    if (!interaction.isButton()) return;

    const [, templateId] = processCustomId(interaction);
    try {
      const existingTemplate = await ensureTemplate(
        this.messageTemplatesService,
        templateId,
      );
      ensureTemplateOwner(existingTemplate, interaction, 'edit');

      const userTimezone = await resolveUserTimezone(
        this.userSettingsService,
        interaction,
      );
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

  @On(Events.InteractionCreate)
  @UseGuards(IsModalInteractionGuard, IsTemplateEditModalInteractionGuard)
  async onTemplateEditModal(
    @IA(ModalFieldsTransformPipe)
    { updateFrequency, timezone, body }: TemplateEditDto,
    @EventParams() eventArgs: ClientEvents[Events.InteractionCreate],
  ): Promise<void> {
    const [interaction] = eventArgs;
    if (!interaction.isModalSubmit()) return;

    const [, templateId] = processCustomId(interaction);
    try {
      const existingTemplate = await ensureTemplate(
        this.messageTemplatesService,
        templateId,
      );

      ensureTemplateOwner(existingTemplate, interaction, 'edit');

      const warnings = [];
      const updateMessages = [];
      const update: Omit<UpdateMessageTemplateDto, 'lastEditedAt'> = {};
      if (body !== existingTemplate.body) {
        update.body = body;
      }
      if (timezone !== existingTemplate.timezone) {
        if (timezone === '') {
          if (existingTemplate.timezone !== null) {
            update.timezone = null;
          }
        } else {
          if (isValidTimeZone(timezone)) {
            update.timezone = timezone;
          } else {
            warnings.push(`The provided timezone is invalid`);
          }
        }
      }
      if (updateFrequency !== existingTemplate.updateFrequency) {
        if (isValidUpdateFrequency(updateFrequency)) {
          update.updateFrequency = updateFrequency;
        } else {
          warnings.push(`The provided update frequency is invalid`);
        }
      }

      if (Object.keys(update).length > 0) {
        await this.messageTemplatesService.update(existingTemplate, {
          ...update,
          lastEditedAt: null,
        });

        await this.messageUpdatesService.queueUpdate(existingTemplate.id);
      }

      if (typeof update.body !== 'undefined') {
        updateMessages.push(`The template text has been replaced`);
      }
      if (typeof update.timezone !== 'undefined') {
        updateMessages.push(
          `The timezone is now set to ${
            update.timezone === null
              ? 'match your user settings'
              : `\`${update.timezone}\``
          }`,
        );
      }
      if (typeof update.updateFrequency !== 'undefined') {
        updateMessages.push(
          `The update frequency is now set to ${getReadableInterval(
            update.updateFrequency,
          )}`,
        );
      }
      let updateText = '';
      if (warnings.length) {
        updateText +=
          '\n' +
          warnings
            .map((m) => `${Emoji.WARNING} ${m}, this value was left unchanged`)
            .join('\n');
      }
      if (updateMessages.length) {
        updateText +=
          '\n' +
          updateMessages.map((m) => `${Emoji.INFO_BUTTON} ${m}`).join('\n') +
          `\n${Emoji.REPEAT_BUTTON} The message will be updated shortly`;
      }

      await interaction.reply({
        content: `${Emoji.CHECK_MARK_BUTTON} Template \`${
          existingTemplate.id
        }\` ${
          warnings.length ? 'edited with warnings' : 'successfully edited'
        }.${updateText}`,
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
