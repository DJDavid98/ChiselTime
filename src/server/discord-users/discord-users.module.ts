import { Module } from '@nestjs/common';
import { DiscordUsersService } from './discord-users.service';

@Module({
  controllers: [],
  providers: [DiscordUsersService],
})
export class DiscordUsersModule {}
