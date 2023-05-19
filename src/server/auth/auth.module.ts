import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { DiscordUsersModule } from '../discord-user/discord-users.module';
import { DiscordUsersService } from '../discord-user/discord-users.service';
import { DiscordStrategy } from './strategies/discord.strategy';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    UsersModule,
    DiscordUsersModule,
    PassportModule.register({}),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, DiscordUsersService, DiscordStrategy],
})
export class AuthModule {}