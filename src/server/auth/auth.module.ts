import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { DiscordUsersModule } from '../discord-users/discord-users.module';
import { DiscordUsersService } from '../discord-users/discord-users.service';
import { DiscordStrategy } from './strategies/discord.strategy';
import { UsersService } from '../users/users.service';
import { StateModule } from '../state/state.module';
import { PatreonUsersModule } from '../patreon-users/patreon-users.module';
import { PatreonUsersService } from '../patreon-users/patreon-users.service';
import { PatreonStrategy } from './strategies/patreon.strategy';
import { DiscordRestModule } from '../discord-rest/discord-rest.module';

@Module({
  imports: [
    UsersModule,
    DiscordUsersModule,
    PatreonUsersModule,
    PassportModule.register({}),
    HttpModule,
    StateModule,
    DiscordRestModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    DiscordUsersService,
    PatreonUsersService,
    DiscordStrategy,
    PatreonStrategy,
  ],
})
export class AuthModule {}
