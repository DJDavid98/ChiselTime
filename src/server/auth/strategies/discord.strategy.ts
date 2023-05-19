import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { serverEnv } from '../../server-env';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly http: HttpService,
    private readonly authService: AuthService,
  ) {
    const callbackURL = `${serverEnv.PUBLIC_HOST}/auth/discord`;
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${new URLSearchParams(
        {
          client_id: serverEnv.DISCORD_CLIENT_ID,
          response_type: 'code',
          scope: serverEnv.DISCORD_CLIENT_SCOPES,
          redirect_url: callbackURL,
        },
      )}}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      clientID: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      callbackURL: callbackURL,
      scope: serverEnv.DISCORD_CLIENT_SCOPES,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    // TODO Scopes?
  ) {
    const userInfo = await this.authService.getDiscordUserInfo({ accessToken });
    let discordUser = await this.authService.findUserFromDiscordId(userInfo.id);
    const tokens = { accessToken, refreshToken };
    if (!discordUser) {
      discordUser = await this.authService.saveDiscordUserInfo(
        userInfo,
        tokens,
      );
    } else {
      discordUser = await this.authService.updateDiscordUserInfo(
        userInfo,
        discordUser,
        tokens,
      );
    }

    return discordUser;
  }
}
