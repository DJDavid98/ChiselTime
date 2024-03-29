import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { Injectable } from '@nestjs/common';
import {
  MessageTimestamp,
  MessageTimestampFormat,
} from '../../bot/classes/message-timestamp';
import { getBareNumberFormatter } from '../../bot/utils/messaging';
import {
  getTotalServerCount,
  getTotalUserCount,
} from '../../bot/utils/usage-stats';
import { serverEnv } from '../../server-env';
import { MessageTemplatesService } from '../../message-templates/message-templates.service';
import { MessageUpdatesService } from '../../message-updates/message-updates.service';

@Command({
  name: 'statistics',
  description: 'Displays various information about the bot',
})
@Injectable()
export class StatisticsCommand {
  constructor(
    private readonly messageTemplatesService: MessageTemplatesService,
    private readonly messageUpdatesService: MessageUpdatesService,
  ) {}

  @Handler()
  async handler(
    interaction: CommandInteraction,
  ): Promise<InteractionReplyOptions> {
    const { shard } = interaction.client;
    const uptimeInMilliseconds = Math.round(process.uptime() * 1000);
    const shardStartTs = new MessageTimestamp(
      new Date(Date.now() - uptimeInMilliseconds),
    );
    const numberFormatter = getBareNumberFormatter(interaction);
    const totalUserNumber = await getTotalUserCount(interaction.client);

    const totalServerCount = `**Total servers joined:** ${numberFormatter.format(
      await getTotalServerCount(interaction.client),
    )}`;
    const totalUserCount =
      totalUserNumber > 0
        ? `**Total users in joined servers:** ${numberFormatter.format(
            await getTotalUserCount(interaction.client),
          )}`
        : null;
    const shardServerCount = shard
      ? `**Servers on this shard:** ${numberFormatter.format(
          interaction.client.guilds.cache.size,
        )}`
      : null;
    const uptime = `**Shard startup time:** ${shardStartTs.toString(
      MessageTimestampFormat.RELATIVE,
    )}`;
    const shardCount = shard
      ? `**Number of shards:** ${numberFormatter.format(shard.count)}`
      : null;
    const totalTemplates = `**Total number of templates:** ${await this.messageTemplatesService.count()}`;
    const updateQueueSize = `**Message updates queue size:** ${await this.messageUpdatesService.queueSize()}`;
    const footer = `*${
      shard
        ? `(These statistics were generated by shard #${shard?.ids.join(', ')})`
        : '(The bot is not currently using sharding)'
    }*`;
    const serverInvite = `**Support server invite URL:** ${serverEnv.DISCORD_INVITE_URL}`;

    const content = [
      totalServerCount,
      totalUserCount,
      shardServerCount,
      uptime,
      shardCount,
      '',
      totalTemplates,
      updateQueueSize,
      '',
      footer,
      // Keep these last to align with the invite embed shown below the message
      '',
      serverInvite,
    ]
      .filter((el) => el !== null)
      .join('\n');

    return {
      content,
      ephemeral: true,
    };
  }
}
