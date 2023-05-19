import { Module } from '@nestjs/common';
import { MessageUpdatesService } from './message-updates.service';
import { MessageUpdatesConsumer } from './message-updates.consumer';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';
import { SharedModule } from '../shared.module';
import { BullModule } from '@nestjs/bull';
import { DiscordRestModule } from '../discord-rest/discord-rest.module';
import { messageUpdatesQueueName } from './message-updates.queue';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: messageUpdatesQueueName,
    }),
    MessageTemplatesModule,
    DiscordRestModule,
  ],
  providers: [MessageUpdatesService, MessageUpdatesConsumer],
})
export class MessageUpdatesModule {}
