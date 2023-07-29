import { Injectable } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { In, Repository } from 'typeorm';
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
    messageTemplate.serverId = createMessageTemplateDto.serverId;
    messageTemplate.channelId = createMessageTemplateDto.channelId;
    messageTemplate.messageId = createMessageTemplateDto.messageId;
    messageTemplate.author = createMessageTemplateDto.author;
    messageTemplate.updateFrequency = createMessageTemplateDto.updateFrequency;
    messageTemplate.body = createMessageTemplateDto.body;
    if (createMessageTemplateDto.timezone) {
      messageTemplate.timezone = createMessageTemplateDto.timezone;
    }
    return await this.messageTemplatesRepository.save(messageTemplate);
  }

  async findAll(options: { staleOnly?: boolean; discordUserIds?: string[] }) {
    let query = this.messageTemplatesRepository.createQueryBuilder('mt');
    if (options.staleOnly) {
      query = query
        .where('mt."lastEditedAt" IS NULL')
        .orWhere('mt."lastEditedAt" + mt."updateFrequency"::interval < NOW()');
    }
    if (options.discordUserIds) {
      query = query.where({
        author: { id: In(options.discordUserIds) },
      });
    }
    return await query.getMany();
  }

  findOne(id: string) {
    return this.messageTemplatesRepository.findOneBy({ id });
  }

  /**
   * Find an existing template for a given channel and message ID
   */
  findExisting(channelId: string, messageId: string) {
    return this.messageTemplatesRepository.findOneBy({ channelId, messageId });
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
    if (typeof updateMessageTemplateDto.timezone !== 'undefined') {
      messageTemplate.timezone = updateMessageTemplateDto.timezone;
    }
    return this.messageTemplatesRepository.save(messageTemplate);
  }

  remove(idOeEntity: string | MessageTemplate) {
    if (typeof idOeEntity === 'string') {
      return this.messageTemplatesRepository.delete({ id: idOeEntity });
    }
    return this.messageTemplatesRepository.remove(idOeEntity);
  }
}
