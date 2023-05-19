import { Test, TestingModule } from '@nestjs/testing';
import { PatreonUsersService } from './patreon-users.service';

describe('PatreonUsersService', () => {
  let service: PatreonUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatreonUsersService],
    }).compile();

    service = module.get<PatreonUsersService>(PatreonUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
