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
export class PatreonStrategy
  extends PassportStrategy(Strategy, 'patreon')
  implements AppUserValidator
{
  private readonly logger = new Logger(PatreonStrategy.name);

  constructor(
    private readonly http: HttpService,
    private readonly authService: AuthService,
    private readonly stateService: StateService,
  ) {
    super({
      authorizationURL: 'https://www.patreon.com/oauth2/authorize',
      tokenURL: 'https://www.patreon.com/api/oauth2/token',
      clientID: serverEnv.PATREON_CLIENT_ID,
      clientSecret: serverEnv.PATREON_CLIENT_SECRET,
      callbackURL: publicPath('/auth/patreon'),
      state: true,
      store: stateService,
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    this.logger.debug('Validating Patreon access token…');
    const userInfo = await this.authService.getPatreonUserInfo(accessToken);
    const patreonUserId = userInfo.id;
    this.logger.debug(
      `Finding local user for Patreon user ID ${patreonUserId}…`,
    );
    let patreonUser = await this.authService.findUserFromPatreonId(
      patreonUserId,
    );
    const tokens = { accessToken, refreshToken };
    if (!patreonUser) {
      patreonUser = await this.authService.savePatreonUserInfo({
        ...userInfo,
        ...tokens,
      });
    } else {
      patreonUser = await this.authService.updatePatreonUserInfo(
        { ...userInfo, ...tokens },
        patreonUser,
      );
    }

    this.logger.debug(
      `Patreon user with ID ${patreonUserId} validated, Discord user ID: ${patreonUser.discordUser.id}`,
    );

    return patreonUser.discordUser.user;
  }
}
