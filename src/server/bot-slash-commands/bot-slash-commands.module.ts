import { Module } from '@nestjs/common';
import { StatisticsCommand } from './commands/statistics.command';
import { CreateTemplateCommand } from './commands/create-template.command';
import { SharedModule } from '../shared.module';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';
import { DiscordUsersModule } from '../discord-users/discord-users.module';
import { UserSettingsModule } from '../user-settings/user-settings.module';
import { SettingCommand } from './commands/setting.command';
import { DiscordModule } from '@discord-nestjs/core';
import { TimezoneSettingCommand } from './commands/setting/timezone-setting.command';
import { ListSettingCommand } from './commands/setting/list-setting.command';
import { EphemeralSettingCommand } from './commands/setting/ephemeral-setting.command';
import { ManageTemplateCommand } from './commands/manage-template.command';
import { MessageUpdatesModule } from '../message-updates/message-updates.module';
import { HeaderSettingCommand } from './commands/setting/header-setting.command';
import { FormatSettingCommand } from './commands/setting/format-setting.command';
import { ColumnsSettingCommand } from './commands/setting/columns-setting.command';

@Module({
  imports: [
    SharedModule,
    MessageTemplatesModule,
    MessageUpdatesModule,
    DiscordUsersModule,
    UserSettingsModule,
    DiscordModule.forFeature(),
  ],
  providers: [
    StatisticsCommand,
    CreateTemplateCommand,
    ManageTemplateCommand,
    SettingCommand,
    TimezoneSettingCommand,
    ListSettingCommand,
    EphemeralSettingCommand,
    HeaderSettingCommand,
    FormatSettingCommand,
    ColumnsSettingCommand,
  ],
})
export class BotSlashCommandsModule {}
