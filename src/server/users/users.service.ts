import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
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
