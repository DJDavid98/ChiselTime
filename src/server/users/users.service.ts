import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordUser } from '../discord-users/entities/discord-user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, save = true) {
    const user = new User();
    user.name = createUserDto.name;
    if (save) {
      await this.userRepository.save(user);
    }
    return user;
  }

  async createForDiscordUser(discordUser: DiscordUser) {
    this.logger.debug(
      `Creating new local user for Discord user (${discordUser.id})…`,
    );
    let appUser = await this.create(
      {
        name: discordUser.name,
      },
      false,
    );
    appUser = await this.userRepository.save(appUser);

    this.logger.debug(
      `Linking Discord user (${discordUser.id}) to new user (${appUser.id})…`,
    );
    discordUser.user = Promise.resolve(appUser);
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(user: User, updateUserDto: UpdateUserDto) {
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    return this.userRepository.save(user);
  }

  remove(user: User) {
    return this.userRepository.remove(user);
  }
}
