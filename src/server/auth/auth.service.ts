import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DiscordUsersService } from '../discord-users/discord-users.service';
import { RESTGetAPIUserResult, Routes } from 'discord-api-types/v10';
import { UsersService } from '../users/users.service';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DiscordUser } from '../discord-users/entities/discord-user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  CreatePatreonUserDto,
  createPatreonUserSchema,
} from '../patreon-users/dto/create-patreon-user.dto';
import { PatreonUser } from '../patreon-users/entities/patreon-user.entity';
import { PatreonUsersService } from '../patreon-users/patreon-users.service';
import { UpdatePatreonUserDto } from '../patreon-users/dto/update-patreon-user.dto';
import { AxiosResponse } from 'axios';
import { DiscordRestService } from '../discord-rest/discord-rest.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly discordUsersService: DiscordUsersService,
    private readonly patreonUsersService: PatreonUsersService,
    private readonly discordRestService: DiscordRestService,
    private readonly entityManager: EntityManager,
    private readonly http: HttpService,
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
        discordUser.user = Promise.resolve(appUser);
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
  }

  async findUserFromDiscordId(discordId: string): Promise<DiscordUser | null> {
    this.logger.debug(`Finding Discord user with ID ${discordId}…`);
    return await this.discordUsersService.findOne(discordId);
  }

  async getPatreonUserInfo(accessToken: string): Promise<CreatePatreonUserDto> {
    const search = new URLSearchParams({
      'fields[user]': 'full_name,social_connections,image_url,url,vanity',
    });
    let result: AxiosResponse;
    try {
      result = await firstValueFrom(
        this.http.get(
          `https://www.patreon.com/api/oauth2/v2/identity?${search}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );
    } catch (err) {
      this.logger.error('Failed to send Patreon identity request');
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Failed to request Patreon user data',
      );
    }

    const validated = createPatreonUserSchema.validate(result.data.data, {
      stripUnknown: true,
    });
    if (validated.error) {
      this.logger.error(
        `Could not validate patreon API identity response:\n${validated.error.annotate(
          true,
        )}\nData:\n${JSON.stringify(result.data)}`,
      );
      throw new InternalServerErrorException(
        'Failed to parse Patreon user data',
      );
    }
    return validated.value;
  }

  async findUserFromPatreonId(patreonId: string): Promise<PatreonUser | null> {
    this.logger.debug(`Finding Patreon user with ID ${patreonId}…`);
    return await this.patreonUsersService.findOne(patreonId);
  }

  async savePatreonUserInfo(
    apiUserInfo: CreatePatreonUserDto,
  ): Promise<PatreonUser> {
    this.logger.debug(`Creating Patreon user information object…`);
    const patreonUser = await this.patreonUsersService.create(
      apiUserInfo,
      false,
    );
    this.logger.debug(
      `Saving information for Patreon user (${patreonUser.id})…`,
    );
    await this.entityManager.transaction(async (em) => {
      if (apiUserInfo.attributes.social_connections.discord) {
        const discordUserId =
          apiUserInfo.attributes.social_connections.discord.user_id;
        this.logger.debug(
          `Finding local Discord user () for Patreon user (${patreonUser.id})…`,
        );
        let discordUser: DiscordUser;
        const localDiscordUser = await this.discordUsersService.findOne(
          discordUserId,
        );
        if (localDiscordUser) {
          discordUser = localDiscordUser;
        } else {
          this.logger.debug(
            `Creating new local Discord user for Patreon user (${patreonUser.id})…`,
          );
          discordUser = await this.discordUsersService.create(
            {
              id: discordUserId,
              name: `Patreon#${patreonUser.id}`,
              displayName: null,
              discriminator: 0,
              avatar: null,
            },
            false,
          );
          discordUser = await em.save(discordUser);
        }

        this.logger.debug(
          `Linking Patreon user (${patreonUser.id}) to new user (${discordUser.id})…`,
        );
        patreonUser.discordUser = Promise.resolve(discordUser);
      }

      await em.save(patreonUser);
    });
    this.logger.debug(
      `Information for Patreon user (${patreonUser.id}) saved successfully`,
    );
    return patreonUser;
  }

  async updatePatreonUserInfo(
    apiUserInfo: UpdatePatreonUserDto,
    patreonUser: PatreonUser,
  ): Promise<PatreonUser> {
    this.logger.debug(`Updating Patreon user (${patreonUser.id})…`);
    return await this.patreonUsersService.update(patreonUser, apiUserInfo);
  }
}
