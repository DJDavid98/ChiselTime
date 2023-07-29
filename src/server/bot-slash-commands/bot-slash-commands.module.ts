import { Module } from '@nestjs/common';
import { StatisticsCommand } from './commands/statistics.command';
import { CreateTemplateCommand } from './commands/create-template.command';
import { SharedModule } from '../shared.module';
import { DeleteTemplateCommand } from './commands/delete-template.command';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';
import { DiscordUsersModule } from '../discord-users/discord-users.module';
import { UserSettingsModule } from '../user-settings/user-settings.module';
import { SettingCommand } from './commands/setting.command';
import { DiscordModule } from '@discord-nestjs/core';
import { TimezoneSettingCommand } from './commands/setting/timezone-setting.command';
import { ListSettingCommand } from './commands/setting/list-setting.command';
import { EphemeralSettingCommand } from './commands/setting/ephemeral-setting.command';
import { EditTemplateCommand } from './commands/edit-template.command';

@Module({
  imports: [
    SharedModule,
    MessageTemplatesModule,
    DiscordUsersModule,
    UserSettingsModule,
    DiscordModule.forFeature(),
  ],
  providers: [
    StatisticsCommand,
    CreateTemplateCommand,
    EditTemplateCommand,
    DeleteTemplateCommand,
    SettingCommand,
    TimezoneSettingCommand,
    ListSettingCommand,
    EphemeralSettingCommand,
  ],
})
export class BotSlashCommandsModule {}
