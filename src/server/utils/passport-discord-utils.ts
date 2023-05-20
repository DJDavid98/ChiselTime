import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';
import { serverEnv } from '../server-env';
import { publicPath } from './public-path';
import { StateService } from '../state/state.service';

export const getDiscordOauthStrategy =
  (stateService: StateService) => (scope: string) => ({
    authorizationURL:
      'https://discordapp.com/api/oauth2/authorize?propmt=none&permissions=0',
    tokenURL: 'https://discordapp.com/api/oauth2/token',
    clientID: serverEnv.DISCORD_CLIENT_ID,
    clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
    callbackURL: publicPath('/auth/discord'),
    scope,
    state: true,
    store: stateService,
  });

export const validateDiscordUser =
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
