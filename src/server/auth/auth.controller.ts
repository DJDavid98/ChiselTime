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

@Controller('auth')
export class AuthController {
  @Get('login/discord')
  @UseGuards(AuthGuard('discord'))
  @Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
  loginWithDiscord() {
    // Because this uses the AuthGuard we do not need to manually redirect to the authorization URL
  }

  @Get('login/patreon')
  @UseGuards(AuthGuard('patreon'))
  @Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
  loginWithPatreon() {
    // Because this uses the AuthGuard we do not need to manually redirect to the authorization URL
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async getUserFromDiscordLogin(@Req() req: Request) {
    return req.user;
  }

  @Get('patreon')
  @UseGuards(AuthGuard('patreon'))
  async getUserFromPatreonLogin(@Req() req: Request) {
    return req.user;
  }
}
