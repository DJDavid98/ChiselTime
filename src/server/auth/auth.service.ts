import { Injectable, Logger } from '@nestjs/common';
import { DiscordUsersService } from '../discord-user/discord-users.service';
import { REST } from '@discordjs/rest';
import { serverEnv } from '../server-env';
import { RESTGetAPIUserResult, Routes } from 'discord-api-types/v10';
import { UsersService } from '../users/users.service';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DiscordUser } from '../discord-user/entities/discord-user.entity';

@Injectable()
export class AuthService {
  private readonly discordBotRestClient: REST;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly discordUsersService: DiscordUsersService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger.debug(`Creating default Discord API REST client…`);
    this.discordBotRestClient = this.createDiscordRestClient(
      serverEnv.DISCORD_BOT_TOKEN,
    );
  }

  private createDiscordRestClient(token: string) {
    this.logger.debug(`Creating Discord API REST client…`);
    return new REST({
      version: '10',
      userAgentAppendix: serverEnv.UA_STRING,
    }).setToken(token);
  }

  getDiscordUserInfo(params: { userId?: string; accessToken?: string }) {
    this.logger.debug(`Getting Discord API REST client…`);
    const effectiveClient = params.accessToken
      ? this.createDiscordRestClient(params.accessToken)
      : this.discordBotRestClient;
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
        discriminator: apiUserInfo.discriminator,
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
        discordUser.user = options.existingUser;
      } else {
        this.logger.debug(
          `Creating new local user for Discord user (${discordUser.id})…`,
        );
        let appUser = await this.usersService.create(
          { name: discordUser.name + '#' + discordUser.discriminator },
          false,
        );
        appUser = await em.save(appUser);

        this.logger.debug(
          `Linking Discord user (${discordUser.id}) to new user (${appUser.id})…`,
        );
        discordUser.user = appUser;
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
    return await this.discordUsersService.update(discordUser, {
      name: apiUserInfo.username,
      discriminator: apiUserInfo.discriminator,
      avatar: apiUserInfo.avatar,
      accessToken: options.accessToken ?? null,
      refreshToken: options.refreshToken ?? null,
      scopes: options.scopes ?? null,
    });
  }

  async findUserFromDiscordId(discordId: string): Promise<DiscordUser | null> {
    this.logger.debug(`Finding Discord user with ID ${discordId}…`);
    return await this.discordUsersService.findOne(discordId);
  }
}
