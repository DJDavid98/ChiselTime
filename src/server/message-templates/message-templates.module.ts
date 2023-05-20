import { Module } from '@nestjs/common';
import { MessageTemplatesService } from './message-templates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { MessageTemplatesController } from './message-templates.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageTemplate]), UsersModule],
  providers: [MessageTemplatesService],
  exports: [MessageTemplatesService],
  controllers: [MessageTemplatesController],
})
export class MessageTemplatesModule {}
