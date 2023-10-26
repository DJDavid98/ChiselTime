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
import { SetHeaderDto } from '../../dto/set-header.dto';

@SubCommand({
  name: 'header',
  description: 'Changes the default header option for your account',
})
@Injectable()
export class HeaderSettingCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent() interaction: ChatInputCommandInteraction,
    @InteractionEvent(SlashCommandPipe) options: SetHeaderDto,
  ): Promise<InteractionReplyOptions> {
    return updateSetting(
      this.discordUsersService,
      this.userSettingsService,
      interaction.user.id,
      KnownSettings.header,
      options.value,
    );
  }
}
