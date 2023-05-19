import { Module } from '@nestjs/common';
import { DiscordUsersService } from './discord-users.service';
import { DiscordUsersController } from './discord-users.controller';

@Module({
  controllers: [DiscordUsersController],
  providers: [DiscordUsersService],
})
export class DiscordUsersModule {}
