import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { DiscordUsersModule } from '../discord-users/discord-users.module';
import { DiscordStrategy } from './strategies/discord.strategy';
import { StateModule } from '../state/state.module';
import { DiscordRestModule } from '../discord-rest/discord-rest.module';
import { SessionUserGuard } from './guards/session-user.guard';
import { DiscordBotStrategy } from './strategies/discord-bot.strategy';

@Module({
  imports: [
    UsersModule,
    DiscordUsersModule,
    PassportModule.register({}),
    HttpModule,
    StateModule,
    DiscordRestModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    DiscordStrategy,
    DiscordBotStrategy,
    SessionUserGuard,
  ],
})
export class AuthModule {}
