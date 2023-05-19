import { Injectable } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';

@Injectable()
export class MessageTemplatesService {
  create(createMessageTemplateDto: CreateMessageTemplateDto) {
    return 'This action adds a new messageTemplate';
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
