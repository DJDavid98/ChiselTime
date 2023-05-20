import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AppUserValidator } from '../../common/app-user-validator';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';
import { StateService } from '../../state/state.service';
import {
  discordUserValidatorFactory,
  getDiscordOauthStrategyFactory,
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
    const getDiscordOauthStrategy =
      getDiscordOauthStrategyFactory(stateService);
    super(getDiscordOauthStrategy(true));
  }

  async validate(accessToken: string, refreshToken: string) {
    const discordUserValidator = discordUserValidatorFactory(
      this.authService,
      this.logger,
    );
    return discordUserValidator(accessToken, refreshToken);
  }
}
