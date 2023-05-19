import { DiscordUser } from '../../discord-users/entities/discord-user.entity';

export class CreateMessageTemplateDto {
  serverId: string;
  channelId: string;
  messageId: string;
  body: string;
  author: DiscordUser;
  updateFrequency: string;
}
