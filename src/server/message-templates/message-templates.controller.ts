import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SessionUserGuard } from '../auth/guards/session-user.guard';
import { MessageTemplatesService } from './message-templates.service';
import { MessageTemplateListDto } from './dto/message-templates-list.dto';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('message-templates')
export class MessageTemplatesController {
  constructor(
    private readonly messageTemplatesService: MessageTemplatesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('list/:uid')
  @UseGuards(SessionUserGuard)
  async list(
    @Param('uid') userId: string,
    @Req() req: Request,
  ): Promise<MessageTemplateListDto> {
    const targetUser = await this.usersService.findOne(userId);
    if (!targetUser) {
      throw new NotFoundException(`Could not find user with ID ${userId}`);
    }
    if (!req.user || targetUser.id !== req.user.id) {
      throw new UnauthorizedException(`You can only list your own templates`);
    }

    const templates = await this.messageTemplatesService.findAll({
      discordUserIds: targetUser.discordUsers.map((du) => du.id),
    });

    return MessageTemplateListDto.from(templates);
  }
}
