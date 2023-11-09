import { AuthService } from '../auth/auth.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { serverEnv } from '../server-env';
import { StateService } from '../state/state.service';
import { StrategyOptions } from 'passport-oauth2';
import { publicPath } from './public-path';

export const getDiscordOauthStrategyFactory =
  (stateService: StateService) =>
  (addBot = false): StrategyOptions => ({
    authorizationURL: `https://discordapp.com/api/oauth2/authorize?${
      addBot ? 'permissions=0' : 'propmt=none'
    }`,
    tokenURL: 'https://discordapp.com/api/oauth2/token',
    clientID: serverEnv.DISCORD_CLIENT_ID,
    clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
    callbackURL: publicPath('/auth/discord'),
    scope: `${serverEnv.DISCORD_CLIENT_SCOPES}${
      addBot ? ` bot applications.commands` : ''
    }`,
    state: true,
    store: stateService,
  });

export const discordUserValidatorFactory =
  (authService: AuthService, logger: Logger) =>
  async (accessToken: string, refreshToken: string) => {
    logger.debug('Validating Discord access token…');
    const userInfo = await authService.getDiscordUserInfo({ accessToken });
    const discordUserId = userInfo.id;
    logger.debug(`Finding local user for Discord user ID ${discordUserId}…`);
    let discordUser = await authService.findUserFromDiscordId(discordUserId);
    const tokens = { accessToken, refreshToken };
    if (!discordUser) {
      logger.debug(`Discord user with ID ${discordUserId} not found, saving…`);
      discordUser = await authService.saveDiscordUserInfo(userInfo, tokens);
    } else {
      logger.debug(`Found Discord user with ID ${discordUserId}, updating…`);
      discordUser = await authService.updateDiscordUserInfo(
        userInfo,
        discordUser,
        tokens,
      );
    }

    const localUser = await discordUser.user;
    if (!localUser) {
      throw new UnauthorizedException(
        `No local user exists for Discord user ${discordUserId}`,
      );
    }

    logger.debug(
      `Discord user with ID ${discordUserId} validated, local user ID: ${localUser?.id}`,
    );

    return localUser;
  };
