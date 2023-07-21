import { Handler, InteractionEvent, SubCommand } from '@discord-nestjs/core';
import {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
} from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordUsersService } from '../../../discord-users/discord-users.service';
import { UserSettingsService } from '../../../user-settings/user-settings.service';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { updateSetting } from '../../../utils/settings';
import { SetTimezoneDto } from '../../dto/set-timezone.dto';
import { timeZonesNames } from '@vvo/tzdb';
import { KnownSettings } from '../../../user-settings/model/known-settings.enum';

@SubCommand({
  name: 'timezone',
  description: 'Changes the default timezone for your account',
})
@Injectable()
export class TimezoneSettingCommand {
  private timezones: string[];

  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
  ) {
    this.timezones = timeZonesNames;
  }

  @Handler()
  async handler(
    @InteractionEvent() interaction: ChatInputCommandInteraction,
    @InteractionEvent(SlashCommandPipe) options: SetTimezoneDto,
  ): Promise<InteractionReplyOptions> {
    return updateSetting(
      this.discordUsersService,
      this.userSettingsService,
      interaction.user.id,
      KnownSettings.timezone,
      options.value,
    );
  }
}
