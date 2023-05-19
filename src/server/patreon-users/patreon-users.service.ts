import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PatreonUser } from './entities/patreon-user.entity';
import { CreatePatreonUserDto } from './dto/create-patreon-user.dto';
import { UpdatePatreonUserDto } from './dto/update-patreon-user.dto';

@Injectable()
export class PatreonUsersService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createPatreonUserDto: CreatePatreonUserDto, save = true) {
    const patreonUser = new PatreonUser();
    patreonUser.id = createPatreonUserDto.id;
    patreonUser.name = CreatePatreonUserDto.getName(
      createPatreonUserDto.attributes,
    );
    patreonUser.avatar = createPatreonUserDto.attributes.image_url;
    if (save) {
      await this.entityManager.save(patreonUser);
    }
    return patreonUser;
  }

  async findOne(id: string) {
    return this.entityManager.findOne(PatreonUser, { where: { id } });
  }

  async delete(id: string) {
    await this.entityManager.delete(PatreonUser, { id });
  }

  async update(
    idOrInstance: string | PatreonUser,
    updatePatreonUserDto: UpdatePatreonUserDto,
  ) {
    const patreonUser =
      typeof idOrInstance === 'string'
        ? await this.findOne(idOrInstance)
        : idOrInstance;

    if (!patreonUser) {
      throw new NotFoundException();
    }

    if (updatePatreonUserDto.attributes) {
      patreonUser.name = CreatePatreonUserDto.getName(
        updatePatreonUserDto.attributes,
      );
      patreonUser.avatar = updatePatreonUserDto.attributes.image_url;
    }
    if (updatePatreonUserDto.accessToken) {
      patreonUser.accessToken = updatePatreonUserDto.accessToken;
    }
    if (updatePatreonUserDto.refreshToken) {
      patreonUser.refreshToken = updatePatreonUserDto.refreshToken;
    }
    if (updatePatreonUserDto.scopes) {
      patreonUser.scopes = updatePatreonUserDto.scopes;
    }
    await this.entityManager.save(patreonUser);
    return patreonUser;
  }
}
