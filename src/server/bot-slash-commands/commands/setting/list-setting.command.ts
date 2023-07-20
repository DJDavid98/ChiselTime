import { Handler, SubCommand } from '@discord-nestjs/core';
import {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
} from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordUsersService } from '../../../discord-users/discord-users.service';
import { UserSettingsService } from '../../../user-settings/user-settings.service';
import { KnownSettings } from '../../../user-settings/entities/user-setting.entity';

@SubCommand({
  name: 'list',
  description: 'Lists your current settings',
})
@Injectable()
export class ListSettingCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Handler()
  async handler(
    interaction: ChatInputCommandInteraction,
  ): Promise<InteractionReplyOptions> {
    const discordUser = await this.discordUsersService.findOne(
      interaction.user.id,
    );
    if (!discordUser) {
      return {
        content: 'Could not find Discord user in the database',
        ephemeral: true,
      };
    }

    const defaultSettings = Object.keys(KnownSettings).reduce(
      (defaults, key) => ({ ...defaults, [key]: null }),
      {},
    );
    const settings = await this.userSettingsService.findAll(discordUser);
    const settingObject = settings.reduce(
      (obj, setting) => ({
        ...obj,
        [setting.setting]: setting.value,
      }),
      defaultSettings,
    );
    return {
      content: [
        'Your current settings: ```json',
        JSON.stringify(settingObject, null, 2),
        '```',
      ].join('\n'),
      ephemeral: true,
    };
  }
}
