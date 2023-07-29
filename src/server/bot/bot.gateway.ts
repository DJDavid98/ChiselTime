import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { ActivityType, Client, Events, Interaction, Message } from 'discord.js';
import { CollectorInterceptor } from '@discord-nestjs/common';
import { MessageTemplate } from '../message-templates/entities/message-template.entity';
import { MessageTemplatesService } from '../message-templates/message-templates.service';
import { serverEnv } from '../server-env';
import {
  editTemplateModalIdPrefix,
  templateInputId,
  timezoneInputId,
  updateFrequencyInputId,
} from '../common/modals';
import { UpdateMessageTemplateDto } from '../message-templates/dto/update-message-template.dto';
import { isValidTimeZone, isValidUpdateFrequency } from '../utils/timezone';
import { getReadableInterval } from '../../client/utils/get-readable-interval';
import { MessageUpdatesService } from '../message-updates/message-updates.service';
import { Emoji } from '../common/emoji';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly messageTemplatesService: MessageTemplatesService,
    private readonly messageUpdatesService: MessageUpdatesService,
  ) {}

  @Once(Events.ClientReady)
  onReady() {
    this.logger.log(`Bot ${this.client.user?.tag} was started!`);
    // Set a custom activity
    const { host } = new URL(serverEnv.PUBLIC_HOST);
    this.client.user?.setActivity({
      type: ActivityType.Playing,
      name: host,
      url: serverEnv.PUBLIC_HOST,
    });
  }

  @On(Events.InteractionCreate)
  @UseInterceptors(CollectorInterceptor)
  async onInteractionCreate(interaction: Interaction) {
    if (interaction.isModalSubmit()) {
      console.debug('interaction.customId', interaction.customId);
      const [action, entityId] = interaction.customId.split('.', 2);
      console.debug('action', action);
      console.debug('entityId', entityId);
      switch (action) {
        case editTemplateModalIdPrefix:
          {
            const existingTemplate = await this.messageTemplatesService.findOne(
              entityId,
            );
            if (!existingTemplate) {
              await interaction.reply({
                content: `No template found with id \`${entityId}\`, it was likely deleted.`,
                ephemeral: true,
              });
              return;
            }

            if (existingTemplate.author.id !== interaction.user.id) {
              await interaction.reply({
                content: 'Only the creator of this template can edit it',
                ephemeral: true,
              });
              return;
            }

            const templateBody =
              interaction.fields.getTextInputValue(templateInputId);
            const templateTimezone =
              interaction.fields.getTextInputValue(timezoneInputId);
            const templateUpdateFrequency =
              interaction.fields.getTextInputValue(updateFrequencyInputId);

            const warnings = [];
            const update: UpdateMessageTemplateDto = { lastEditedAt: null };
            if (templateBody !== existingTemplate.body) {
              update.body = templateBody;
            }
            if (templateTimezone !== existingTemplate.timezone) {
              if (templateTimezone === '') {
                if (existingTemplate.timezone !== null) {
                  update.timezone = null;
                }
              } else {
                if (isValidTimeZone(templateTimezone)) {
                  update.timezone = templateTimezone;
                } else {
                  warnings.push(`The provided timezone is invalid`);
                }
              }
            }
            if (templateUpdateFrequency !== existingTemplate.updateFrequency) {
              if (isValidUpdateFrequency(templateUpdateFrequency)) {
                update.updateFrequency = templateUpdateFrequency;
              } else {
                warnings.push(`The provided update frequency is invalid`);
              }
            }

            await this.messageTemplatesService.update(existingTemplate, update);

            await this.messageUpdatesService.queueUpdate(existingTemplate.id);

            const updateMessages = [];
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
                  .map(
                    (m) =>
                      `${Emoji.WARNING} ${m}, this value was left unchanged`,
                  )
                  .join('\n');
            }
            if (updateMessages.length) {
              updateText +=
                '\n' +
                updateMessages
                  .map((m) => `${Emoji.INFO_BUTTON} ${m}`)
                  .join('\n') +
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
          }
          break;
      }
    }
  }

  // TODO Also perform cleanup on application startup
  @On(Events.MessageDelete)
  @UseInterceptors(CollectorInterceptor)
  async onMessageDelete(message: Message) {
    if (!message.guildId || !message.author.bot) {
      return;
    }

    const where = {
      messageId: message.id,
      channelId: message.channelId,
    } satisfies Partial<MessageTemplate>;
    this.logger.debug(
      `Detected bot message deletion (${JSON.stringify(where)})`,
    );

    const existingTemplate = await this.messageTemplatesService.findExisting(
      where.channelId,
      where.messageId,
    );
    if (!existingTemplate) {
      this.logger.debug(
        `No templates found for deleted message ${JSON.stringify(where)})`,
      );
      return;
    }
    const existingTemplateId = existingTemplate.id;

    this.logger.log(
      `Found template with ID ${existingTemplateId} for a deleted message, cleaning up…`,
    );
    await this.messageTemplatesService.remove(existingTemplate);
    this.logger.log(`Template ${existingTemplateId} cleaned up successfully`);
  }
}
