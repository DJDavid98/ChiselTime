import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { SessionUserGuard } from './guards/session-user.guard';

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
  async getUserFromDiscordLogin(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      req.session.userId = req.user.id;
    }

    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect('/');
  }

  @Get('patreon')
  @UseGuards(AuthGuard('patreon'))
  @Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
  async getUserFromPatreonLogin() {
    // Because this uses the AuthGuard we do not need to manually redirect to the authorization URL
  }

  @Post('logout')
  // TODO CSRF protection
  @UseGuards(SessionUserGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    delete req.session.userId;

    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect('/');
  }
}
