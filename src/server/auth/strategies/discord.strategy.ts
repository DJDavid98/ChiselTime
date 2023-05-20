import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';
import { StateService } from '../../state/state.service';
import { AppUserValidator } from '../../common/app-user-validator';
import {
  discordUserValidatorFactory,
  getDiscordOauthStrategyFactory,
} from '../../utils/passport-discord-utils';

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
    const getDiscordOauthStrategy =
      getDiscordOauthStrategyFactory(stateService);
    super(getDiscordOauthStrategy());
  }

  async validate(accessToken: string, refreshToken: string) {
    const discordUserValidator = discordUserValidatorFactory(
      this.authService,
      this.logger,
    );
    return discordUserValidator(accessToken, refreshToken);
  }
}
