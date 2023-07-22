import { Module } from '@nestjs/common';
import { MessageUpdatesService } from './message-updates.service';
import { MessageUpdatesConsumer } from './message-updates.consumer';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';
import { SharedModule } from '../shared.module';
import { BullModule } from '@nestjs/bull';
import { DiscordRestModule } from '../discord-rest/discord-rest.module';
import { messageUpdatesQueueName } from './message-updates.queue';
import { UserSettingsModule } from '../user-settings/user-settings.module';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: messageUpdatesQueueName,
    }),
    MessageTemplatesModule,
    UserSettingsModule,
    DiscordRestModule,
  ],
  providers: [MessageUpdatesService, MessageUpdatesConsumer],
})
export class MessageUpdatesModule {}
