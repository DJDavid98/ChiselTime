import { Test, TestingModule } from '@nestjs/testing';
import { MessageUpdatesService } from './message-updates.service';

describe('MessageUpdatesService', () => {
  let service: MessageUpdatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageUpdatesService],
    }).compile();

    service = module.get<MessageUpdatesService>(MessageUpdatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
