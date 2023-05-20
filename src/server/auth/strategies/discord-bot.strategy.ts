import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AppUserValidator } from '../../common/app-user-validator';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';
import { StateService } from '../../state/state.service';
import { serverEnv } from '../../server-env';
import {
  getDiscordOauthStrategy,
  validateDiscordUser,
} from '../../utils/passport-discord-utils';

@Injectable()
export class DiscordBotStrategy
  extends PassportStrategy(Strategy, 'discord-bot')
  implements AppUserValidator
{
  private readonly logger = new Logger(DiscordBotStrategy.name);

  constructor(
    private readonly http: HttpService,
    private readonly authService: AuthService,
    private readonly stateService: StateService,
  ) {
    super(
      getDiscordOauthStrategy(stateService)(
        `${serverEnv.DISCORD_CLIENT_SCOPES} bot applications.commands`,
      ),
    );
  }

  async validate(accessToken: string, refreshToken: string) {
    return validateDiscordUser(this.authService, this.logger)(
      accessToken,
      refreshToken,
    );
  }
}
