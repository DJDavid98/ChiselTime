import { Logger } from '@nestjs/common';
import { MessageTemplatesService } from '../message-templates/message-templates.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPIChannelMessageResult,
  Routes,
} from 'discord-api-types/v10';
import { replaceIntervalsInString } from '../utils/interval-parsing/replace-intervals-in-string';
import { DiscordRestService } from '../discord-rest/discord-rest.service';
import {
  messageUpdatesConcurrency,
  MessageUpdatesQueueData,
  messageUpdatesQueueName,
} from './message-updates.queue';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { KnownSettings } from '../user-settings/model/known-settings.enum';
import { UserSetting } from '../user-settings/entities/user-setting.entity';
import { fallbackTimezone } from '../common/time';

@Processor(messageUpdatesQueueName)
export class MessageUpdatesConsumer {
  private readonly logger = new Logger(MessageUpdatesConsumer.name);

  constructor(
    private readonly messageTemplatesService: MessageTemplatesService,
    private readonly discordRestService: DiscordRestService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Process({ concurrency: messageUpdatesConcurrency })
  async updateMessage(job: Job<MessageUpdatesQueueData>) {
    const messageTemplateId = job.data.id;
    this.logger.debug(
      `Job ${job.id} updating stale template with ID ${messageTemplateId}…`,
    );

    const messageTemplate = await this.messageTemplatesService.findOne(
      messageTemplateId,
    );
    if (!messageTemplate) {
      this.logger.warn(
        `Could not find message template with ID ${messageTemplateId}`,
      );
      return;
    }

    const timezoneSetting = await this.userSettingsService.getSetting(
      messageTemplate.author,
      KnownSettings.timezone,
    );
    let timezone: string;
    if (messageTemplate.timezone) {
      timezone = messageTemplate.timezone;
    } else {
      timezone =
        (timezoneSetting && UserSetting.getDecodedValue(timezoneSetting)) ??
        fallbackTimezone;
    }

    const body: RESTPatchAPIChannelMessageJSONBody = {
      content: replaceIntervalsInString(messageTemplate.body, timezone),
    };
    const endpoint = Routes.channelMessage(
      messageTemplate.channelId,
      messageTemplate.messageId,
    );
    this.logger.debug(`Executing Discord API PATCH ${endpoint}…`);
    let result: RESTPatchAPIChannelMessageResult;
    try {
      result = (await this.discordRestService.defaultClient.patch(
        Routes.channelMessage(
          messageTemplate.channelId,
          messageTemplate.messageId,
        ),
        { body },
      )) as RESTPatchAPIChannelMessageResult;
    } catch (error) {
      if ('status' in error) {
        switch (error.status) {
          case 404:
            this.logger.debug(
              `Message for template ${messageTemplate.id} was deleted from channel, cleaning up…`,
            );
            await this.messageTemplatesService.remove(messageTemplate.id);
            this.logger.debug(
              `Message template ${messageTemplate.id} deleted successfully`,
            );
            return;
        }
      }
      throw error;
    }
    if (result.edited_timestamp) {
      this.logger.debug(`Updating template last edit timestamp…`);
      await this.messageTemplatesService.update(messageTemplate, {
        lastEditedAt: new Date(result.edited_timestamp),
      });
    }
    this.logger.debug(
      `Message for template ${messageTemplate.id} edited successfully`,
    );
  }
}
