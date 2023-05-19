import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DiscordUser } from './entities/discord-user.entity';
import { CreateDiscordUserDto } from './dto/create-discord-user.dto';
import { UpdateDiscordUserDto } from './dto/update-discord-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiscordUsersService {
  constructor(
    @InjectRepository(DiscordUser)
    private readonly discordUserRepository: Repository<DiscordUser>,
  ) {}

  async create(createDiscordUserDto: CreateDiscordUserDto, save = true) {
    const discordUser = new DiscordUser();
    discordUser.id = createDiscordUserDto.id;
    discordUser.name = createDiscordUserDto.name;
    discordUser.discriminator = createDiscordUserDto.discriminator;
    discordUser.avatar = createDiscordUserDto.avatar;
    if (save) {
      await this.discordUserRepository.save(discordUser);
    }
    return discordUser;
  }

  async findOne(id: string) {
    return this.discordUserRepository.findOneBy({ id });
  }

  async delete(id: string) {
    await this.discordUserRepository.delete({ id });
  }

  async update(
    idOrInstance: string | DiscordUser,
    updateDiscordUserDto: UpdateDiscordUserDto,
  ) {
    const discordUser =
      typeof idOrInstance === 'string'
        ? await this.findOne(idOrInstance)
        : idOrInstance;

    if (!discordUser) {
      throw new NotFoundException();
    }

    if (updateDiscordUserDto.name) {
      discordUser.name = updateDiscordUserDto.name;
    }
    if (updateDiscordUserDto.discriminator) {
      discordUser.discriminator = updateDiscordUserDto.discriminator;
    }
    if (updateDiscordUserDto.avatar) {
      discordUser.avatar = updateDiscordUserDto.avatar;
    }
    if (updateDiscordUserDto.accessToken) {
      discordUser.accessToken = updateDiscordUserDto.accessToken;
    }
    if (updateDiscordUserDto.refreshToken) {
      discordUser.refreshToken = updateDiscordUserDto.refreshToken;
    }
    if (updateDiscordUserDto.scopes) {
      discordUser.scopes = updateDiscordUserDto.scopes;
    }
    await this.discordUserRepository.save(discordUser);
    return discordUser;
  }
}
