import { Test, TestingModule } from '@nestjs/testing';
import { DiscordRestService } from './discord-rest.service';

describe('DiscordRestService', () => {
  let service: DiscordRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordRestService],
    }).compile();

    service = module.get<DiscordRestService>(DiscordRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
