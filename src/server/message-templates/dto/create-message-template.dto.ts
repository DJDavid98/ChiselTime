import { DiscordUser } from '../../discord-users/entities/discord-user.entity';

export class CreateMessageTemplateDto {
  channelId: string;
  messageId: string;
  body: string;
  author: DiscordUser;
  updateFrequency: string;
}
