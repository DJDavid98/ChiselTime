import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';
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
      discordUser = await authService.saveDiscordUserInfo(userInfo, tokens);
    } else {
      discordUser = await authService.updateDiscordUserInfo(
        userInfo,
        discordUser,
        tokens,
      );
    }

    const localUser = await discordUser.user;
    logger.debug(
      `Discord user with ID ${discordUserId} validated, local user ID: ${localUser.id}`,
    );

    return localUser;
  };
