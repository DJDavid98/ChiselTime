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
import { KnownSettings } from '../../../user-settings/model/known-settings.enum';
import { SetColumnsDto } from '../../dto/set-columns.dto';

@SubCommand({
  name: 'columns',
  description: 'Changes the default columns option for your account',
})
@Injectable()
export class ColumnsSettingCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent() interaction: ChatInputCommandInteraction,
    @InteractionEvent(SlashCommandPipe) options: SetColumnsDto,
  ): Promise<InteractionReplyOptions> {
    return updateSetting(
      this.discordUsersService,
      this.userSettingsService,
      interaction.user.id,
      KnownSettings.columns,
      options.value,
    );
  }
}
