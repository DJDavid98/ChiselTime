import { Command } from '@discord-nestjs/core';
import { ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { TimezoneSettingCommand } from './setting/timezone-setting.command';
import { ListSettingCommand } from './setting/list-setting.command';
import { EphemeralSettingCommand } from './setting/ephemeral-setting.command';
import { HeaderSettingCommand } from './setting/header-setting.command';
import { FormatSettingCommand } from './setting/format-setting.command';
import { ColumnsSettingCommand } from './setting/columns-setting.command';

@Command({
  name: 'setting',
  description: 'Changes settings for your account',
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  dmPermission: true,
  include: [
    TimezoneSettingCommand,
    ListSettingCommand,
    EphemeralSettingCommand,
    HeaderSettingCommand,
    FormatSettingCommand,
    ColumnsSettingCommand,
  ],
})
@Injectable()
export class SettingCommand {}
