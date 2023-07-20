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
import { KnownSettings } from '../../../user-settings/entities/user-setting.entity';
import { SetEphemeralDto } from '../../dto/set-ephemeral.dto';

@SubCommand({
  name: 'ephemeral',
  description: 'Changes the default ephemeral response type for your account',
})
@Injectable()
export class EphemeralSettingCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent() interaction: ChatInputCommandInteraction,
    @InteractionEvent(SlashCommandPipe) options: SetEphemeralDto,
  ): Promise<InteractionReplyOptions> {
    return updateSetting(
      this.discordUsersService,
      this.userSettingsService,
      interaction.user.id,
      KnownSettings.ephemeral,
      options.value,
    );
  }
}
