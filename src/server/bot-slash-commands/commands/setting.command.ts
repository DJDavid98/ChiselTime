import { Command } from '@discord-nestjs/core';
import { ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { TimezoneSettingCommand } from './setting/timezone-setting.command';
import { ListSettingCommand } from './setting/list-setting.command';
import { EphemeralSettingCommand } from './setting/ephemeral-setting.command';

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
  ],
})
@Injectable()
export class SettingCommand {}
