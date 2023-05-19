import { Test, TestingModule } from '@nestjs/testing';
import { DiscordUsersController } from './discord-users.controller';
import { DiscordUsersService } from './discord-users.service';

describe('DiscordUserController', () => {
  let controller: DiscordUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordUsersController],
      providers: [DiscordUsersService],
    }).compile();

    controller = module.get<DiscordUsersController>(DiscordUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
