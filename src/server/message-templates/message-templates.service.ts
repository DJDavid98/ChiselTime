import { Injectable } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { Repository } from 'typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageTemplatesService {
  constructor(
    @InjectRepository(MessageTemplate)
    private readonly messageTemplatesRepository: Repository<MessageTemplate>,
  ) {}

  async create(createMessageTemplateDto: CreateMessageTemplateDto) {
    const messageTemplate = new MessageTemplate();
    messageTemplate.channelId = createMessageTemplateDto.channelId;
    messageTemplate.messageId = createMessageTemplateDto.messageId;
    messageTemplate.author = createMessageTemplateDto.author;
    messageTemplate.updateFrequency = createMessageTemplateDto.updateFrequency;
    messageTemplate.body = createMessageTemplateDto.body;
    return await this.messageTemplatesRepository.save(messageTemplate);
  }

  async findAll(options: { staleOnly?: boolean }) {
    let query = this.messageTemplatesRepository.createQueryBuilder('mt');
    if (options.staleOnly) {
      query = query
        .where('mt."lastEditedAt" IS NULL')
        .orWhere('mt."lastEditedAt" + mt."updateFrequency"::interval < NOW()');
    }
    return await query.getMany();
  }

  findOne(id: string) {
    return this.messageTemplatesRepository.findOneBy({ id });
  }

  update(
    messageTemplate: MessageTemplate,
    updateMessageTemplateDto: UpdateMessageTemplateDto,
  ) {
    if (updateMessageTemplateDto.body) {
      messageTemplate.body = updateMessageTemplateDto.body;
    }
    if (updateMessageTemplateDto.updateFrequency) {
      messageTemplate.updateFrequency =
        updateMessageTemplateDto.updateFrequency;
    }
    if (updateMessageTemplateDto.lastEditedAt) {
      messageTemplate.lastEditedAt = updateMessageTemplateDto.lastEditedAt;
    }
    return this.messageTemplatesRepository.save(messageTemplate);
  }

  remove(id: string) {
    return this.messageTemplatesRepository.delete({ id });
  }
}
