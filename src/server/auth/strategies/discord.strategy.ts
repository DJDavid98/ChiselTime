import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { serverEnv } from '../../server-env';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';
import { StateService } from '../../state/state.service';
import { publicPath } from '../../utils/public-path';
import { AppUserValidator } from '../../common/app-user-validator';

@Injectable()
export class DiscordStrategy
  extends PassportStrategy(Strategy, 'discord')
  implements AppUserValidator
{
  private readonly logger = new Logger(DiscordStrategy.name);

  constructor(
    private readonly http: HttpService,
    private readonly authService: AuthService,
    private readonly stateService: StateService,
  ) {
    super({
      authorizationURL:
        'https://discordapp.com/api/oauth2/authorize?propmt=none&permissions=0',
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      clientID: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      callbackURL: publicPath('/auth/discord'),
      scope: serverEnv.DISCORD_CLIENT_SCOPES,
      state: true,
      store: stateService,
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    this.logger.debug('Validating Discord access token…');
    const userInfo = await this.authService.getDiscordUserInfo({ accessToken });
    const discordUserId = userInfo.id;
    this.logger.debug(
      `Finding local user for Discord user ID ${discordUserId}…`,
    );
    let discordUser = await this.authService.findUserFromDiscordId(
      discordUserId,
    );
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

    this.logger.debug(
      `Discord user with ID ${discordUserId} validated, local user ID: ${discordUser.user.id}`,
    );

    return discordUser.user;
  }
}
