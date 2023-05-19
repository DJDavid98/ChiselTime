import { Module } from '@nestjs/common';
import { DiscordUsersService } from './discord-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordUser } from './entities/discord-user.entity';
import { PatreonUsersModule } from '../patreon-users/patreon-users.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiscordUser]), PatreonUsersModule],
  controllers: [],
  providers: [DiscordUsersService],
  exports: [DiscordUsersService],
})
export class DiscordUsersModule {
  constructor(private readonly service: DiscordUsersService) {}

  findOne(id: string) {
    return this.service.findOne(id);
  }
}
