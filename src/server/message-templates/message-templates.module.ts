import { Module } from '@nestjs/common';
import { MessageTemplatesService } from './message-templates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageTemplate])],
  providers: [MessageTemplatesService],
  exports: [MessageTemplatesService],
})
export class MessageTemplatesModule {}
