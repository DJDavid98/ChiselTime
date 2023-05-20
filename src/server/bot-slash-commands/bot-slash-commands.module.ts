import { Module } from '@nestjs/common';
import { StatisticsCommand } from './commands/statistics.command';
import { CreateTemplateCommand } from './commands/create-template.command';
import { SharedModule } from '../shared.module';
import { DeleteTemplateCommand } from './commands/delete-template.command';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';
import { DiscordUsersModule } from '../discord-users/discord-users.module';

@Module({
  imports: [SharedModule, MessageTemplatesModule, DiscordUsersModule],
  providers: [StatisticsCommand, CreateTemplateCommand, DeleteTemplateCommand],
})
export class BotSlashCommandsModule {}
