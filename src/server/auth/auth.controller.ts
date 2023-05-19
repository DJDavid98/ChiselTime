import {
  Controller,
  Get,
  HttpStatus,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { clientEnv } from '../../client/client-env';
import { publicPath } from '../utils/public-path';

@Controller('auth')
export class AuthController {
  @Get('login/discord')
  @Redirect(
    `https://discord.com/oauth2/authorize?${new URLSearchParams({
      client_id: clientEnv.DISCORD_CLIENT_ID,
      permissions: '0',
      response_type: 'code',
      scope: clientEnv.DISCORD_CLIENT_SCOPES,
      redirect_uri: publicPath('/auth/discord'),
      prompt: 'none',
    })}`,
    HttpStatus.TEMPORARY_REDIRECT,
  )
  loginWithDiscord() {
    // noop
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async getUserFromDiscordLogin(@Req() req: Request) {
    return req.user;
  }
}
