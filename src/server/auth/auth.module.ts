import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { DiscordUsersModule } from '../discord-users/discord-users.module';
import { DiscordStrategy } from './strategies/discord.strategy';
import { StateModule } from '../state/state.module';
import { PatreonUsersModule } from '../patreon-users/patreon-users.module';
import { PatreonStrategy } from './strategies/patreon.strategy';
import { DiscordRestModule } from '../discord-rest/discord-rest.module';
import { SessionUserGuard } from './guards/session-user.guard';

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
  providers: [AuthService, DiscordStrategy, PatreonStrategy, SessionUserGuard],
})
export class AuthModule {}
