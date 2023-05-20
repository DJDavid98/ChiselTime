import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplatesController } from './message-templates.controller';

describe('MessageTemplatesController', () => {
  let controller: MessageTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageTemplatesController],
    }).compile();

    controller = module.get<MessageTemplatesController>(
      MessageTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
