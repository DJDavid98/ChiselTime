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

@Module({
  imports: [
    UsersModule,
    DiscordUsersModule,
    PassportModule.register({}),
    HttpModule,
    StateModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, DiscordUsersService, DiscordStrategy],
})
export class AuthModule {}
