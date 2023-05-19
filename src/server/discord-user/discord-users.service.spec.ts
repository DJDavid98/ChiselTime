import { Test, TestingModule } from '@nestjs/testing';
import { DiscordUsersService } from './discord-users.service';

describe('DiscordUserService', () => {
  let service: DiscordUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordUsersService],
    }).compile();

    service = module.get<DiscordUsersService>(DiscordUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
