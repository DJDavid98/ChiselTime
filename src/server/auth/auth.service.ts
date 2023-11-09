import { Injectable, Logger } from '@nestjs/common';
import { DiscordUsersService } from '../discord-users/discord-users.service';
import { RESTGetAPIUserResult, Routes } from 'discord-api-types/v10';
import { UsersService } from '../users/users.service';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DiscordUser } from '../discord-users/entities/discord-user.entity';
import { DiscordRestService } from '../discord-rest/discord-rest.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly discordUsersService: DiscordUsersService,
    private readonly discordRestService: DiscordRestService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger.debug(`Creating default Discord API REST client…`);
  }

  getDiscordUserInfo(params: { userId?: string; accessToken?: string }) {
    this.logger.debug(`Getting Discord API REST client…`);
    const effectiveClient = params.accessToken
      ? this.discordRestService.clientFactory(params.accessToken)
      : this.discordRestService.defaultClient;
    this.logger.debug(
      `Retrieving Discord user info ${
        params.accessToken ? 'via access token' : `for user ID ${params.userId}`
      }…`,
    );
    return effectiveClient.get(Routes.user(params.userId), {
      authPrefix: params.accessToken ? 'Bearer' : undefined,
    }) as Promise<RESTGetAPIUserResult>;
  }

  async saveDiscordUserInfo(
    apiUserInfo: RESTGetAPIUserResult,
    options: {
      existingUser?: User;
      accessToken?: string;
      refreshToken?: string;
      scopes?: string;
    },
  ): Promise<DiscordUser> {
    this.logger.debug(`Creating Discord user information object…`);
    const discordUser = await this.discordUsersService.create(
      {
        id: apiUserInfo.id,
        name: apiUserInfo.username,
        displayName:
          'global_name' in apiUserInfo
            ? (apiUserInfo.global_name as string)
            : null,
        discriminator: parseInt(apiUserInfo.discriminator, 10),
        avatar: apiUserInfo.avatar,
        accessToken: options.accessToken ?? null,
        refreshToken: options.refreshToken ?? null,
        scopes: options.scopes ?? null,
      },
      false,
    );
    this.logger.debug(
      `Saving information for Discord user (${discordUser.id})…`,
    );
    await this.entityManager.transaction(async (em) => {
      if (options.existingUser) {
        this.logger.debug(
          `Linking Discord user ${discordUser.id} to existing user ${options.existingUser.id}…`,
        );
        discordUser.user = Promise.resolve(options.existingUser);
      } else {
        await this.usersService.createForDiscordUser(discordUser);
      }

      await em.save(discordUser);
    });
    this.logger.debug(
      `Information for Discord user (${discordUser.id}) saved successfully`,
    );
    return discordUser;
  }

  async updateDiscordUserInfo(
    apiUserInfo: RESTGetAPIUserResult,
    discordUser: DiscordUser,
    options: {
      accessToken?: string;
      refreshToken?: string;
      scopes?: string;
    },
  ): Promise<DiscordUser> {
    this.logger.debug(`Updating Discord user (${discordUser.id})…`);
    const result = await this.discordUsersService.update(discordUser, {
      name: apiUserInfo.username,
      displayName:
        'global_name' in apiUserInfo
          ? (apiUserInfo.global_name as string)
          : null,
      discriminator: parseInt(apiUserInfo.discriminator, 10),
      avatar: apiUserInfo.avatar,
      accessToken: options.accessToken ?? null,
      refreshToken: options.refreshToken ?? null,
      scopes: options.scopes ?? null,
    });
    const localUser = await discordUser.user;
    if (!localUser) {
      await this.usersService.createForDiscordUser(discordUser);
      await this.entityManager.save(discordUser);
    }
    return result;
  }

  async findUserFromDiscordId(discordId: string): Promise<DiscordUser | null> {
    this.logger.debug(`Finding Discord user with ID ${discordId}…`);
    return await this.discordUsersService.findOne(discordId);
  }
}
