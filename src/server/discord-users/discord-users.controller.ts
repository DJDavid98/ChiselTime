import { Controller } from '@nestjs/common';
import { DiscordUsersService } from './discord-users.service';

@Controller('discord-users')
export class DiscordUsersController {
  constructor(private readonly discordUserService: DiscordUsersService) {}
}
