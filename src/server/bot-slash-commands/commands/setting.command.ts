import {
  Command,
  Handler,
  InjectCauseEvent,
  InteractionEvent,
} from '@discord-nestjs/core';
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  PermissionFlagsBits,
} from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordUsersService } from '../../discord-users/discord-users.service';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { SetSettingDto } from '../dto/set-setting.dto';
import { KnownSettings } from '../../user-settings/entities/user-setting.entity';

@Command({
  name: 'setting',
  description: 'Changes settings for your account',
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  dmPermission: true,
})
@Injectable()
export class SettingCommand {
  constructor(
    private readonly discordUsersService: DiscordUsersService,
    private readonly userSettingsService: UserSettingsService,
    @InjectCauseEvent()
    private readonly causeInteraction: ChatInputCommandInteraction,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) options: SetSettingDto,
  ): Promise<InteractionReplyOptions> {
    // TODO Implement, check why there are no params registered
    if (Date.now()) {
      return {
        content: 'This functionality is not yet implemented',
        ephemeral: true,
      };
    }

    const discordUser = await this.discordUsersService.findOne(
      this.causeInteraction.user.id,
    );
    if (!discordUser) {
      return {
        content: 'Could not find Discord user in the database',
        ephemeral: true,
      };
    }

    const appUser = await discordUser.user;
    try {
      await this.userSettingsService.setSetting(
        appUser,
        options.setting as KnownSettings,
        // TODO Handle non-string settings
        options.value,
      );
    } catch (e) {
      console.error(e);
      return {
        content: `Could not update setting: ${e.message}`,
        ephemeral: true,
      };
    }

    return {
      content: 'Setting updated successfully',
      ephemeral: true,
    };
  }
}
