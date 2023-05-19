import { Module } from '@nestjs/common';
import { MessageTemplatesService } from './message-templates.service';

@Module({
  controllers: [],
  providers: [MessageTemplatesService],
})
export class MessageTemplatesModule {}
