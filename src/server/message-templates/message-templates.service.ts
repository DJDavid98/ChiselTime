import { Injectable } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { EntityManager } from 'typeorm';
import { MessageTemplate } from './entities/message-template.entity';

@Injectable()
export class MessageTemplatesService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createMessageTemplateDto: CreateMessageTemplateDto) {
    const messageTemplate = new MessageTemplate();
    messageTemplate.channelId = createMessageTemplateDto.channelId;
    messageTemplate.messageId = createMessageTemplateDto.messageId;
    messageTemplate.author = createMessageTemplateDto.author;
    messageTemplate.updateFrequency = createMessageTemplateDto.updateFrequency;
    messageTemplate.body = createMessageTemplateDto.body;
    return await this.entityManager.save(messageTemplate);
  }

  findAll() {
    return `This action returns all messageTemplates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageTemplate`;
  }

  update(id: number, updateMessageTemplateDto: UpdateMessageTemplateDto) {
    return `This action updates a #${id} messageTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageTemplate`;
  }
}
