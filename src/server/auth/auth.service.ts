import { Injectable } from '@nestjs/common';
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

  constructor(
    private readonly usersService: UsersService,
    private readonly discordUsersService: DiscordUsersService,
    private readonly entityManager: EntityManager,
  ) {
    this.discordBotRestClient = AuthService.createDiscordRestClient(
      serverEnv.DISCORD_BOT_TOKEN,
    );
  }

  private static createDiscordRestClient(token: string) {
    return new REST({
      version: '10',
      userAgentAppendix: serverEnv.UA_STRING,
    }).setToken(token);
  }

  getDiscordUserInfo(params: { userId?: string; accessToken?: string }) {
    const effectiveClient = params.accessToken
      ? AuthService.createDiscordRestClient(params.accessToken)
      : this.discordBotRestClient;
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
    await this.entityManager.transaction(async (em) => {
      if (options.existingUser) {
        discordUser.user = options.existingUser;
      } else {
        const appUser = await this.usersService.create(
          { name: discordUser.name + '#' + discordUser.discriminator },
          false,
        );
        await em.save(appUser);

        discordUser.user = appUser;
      }

      await em.save(discordUser);
    });
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
    return await this.discordUsersService.findOne(discordId);
  }
}
