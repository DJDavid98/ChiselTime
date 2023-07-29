import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessageTemplatesService } from '../message-templates/message-templates.service';
import { InjectQueue } from '@nestjs/bull';
import { JobStatus, Queue } from 'bull';
import {
  MessageUpdatesQueueData,
  messageUpdatesQueueName,
} from './message-updates.queue';
import { serverEnv } from '../server-env';

@Injectable()
export class MessageUpdatesService {
  private readonly logger = new Logger(MessageUpdatesService.name);

  constructor(
    private readonly messageTemplatesService: MessageTemplatesService,
    @InjectQueue(messageUpdatesQueueName)
    private readonly messageUpdateQueue: Queue<MessageUpdatesQueueData>,
  ) {
    if (serverEnv.LOCAL) {
      void this.clearQueue();
    }
  }

  /**
   * Clear out existing queue in case any were persisted from the previous run
   */
  private async clearQueue() {
    const queueItems = await this.messageUpdateQueue.count();
    if (queueItems > 0) {
      this.logger.debug(`Clearing existing queue with ${queueItems} item(s)…`);
      await this.messageUpdateQueue.empty();
      this.logger.debug(`Existing queue cleared`);
    } else {
      this.logger.debug(`No existing queue items found`);
    }
  }

  public queueUpdate(templateId: string) {
    return this.messageUpdateQueue.add({ id: templateId });
  }

  public queueSize() {
    return this.messageUpdateQueue.count();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Processing message updates…');

    const staleTemplates = await this.messageTemplatesService.findAll({
      staleOnly: true,
    });
    if (staleTemplates.length > 0) {
      this.logger.debug(
        `Found ${staleTemplates.length} stale template(s), queueing update jobs…`,
      );

      // Get a list of jobs which are already queued or running
      const pendingStates: JobStatus[] = ['active', 'waiting'];
      const pendingJobs = await this.messageUpdateQueue.getJobs(pendingStates);
      const pendingTemplateIdsSet = new Set<string>(
        pendingJobs.map((job) => job.data.id),
      );
      console.debug(
        `There are ${pendingJobs.length} jobs in ${pendingStates.join(
          '/',
        )} states`,
      );

      // Add templates not yet in the queue in bulk
      await this.messageUpdateQueue.addBulk(
        staleTemplates.reduce(
          (queueJobs, template) =>
            !pendingTemplateIdsSet.has(template.id)
              ? // Do not queue pending templates
                [
                  ...queueJobs,
                  {
                    data: { id: template.id },
                  },
                ]
              : queueJobs,
          [],
        ),
      );
    } else {
      this.logger.debug(`No stale templates found`);
    }

    this.logger.debug('Message updates processed successfully');
  }
}
