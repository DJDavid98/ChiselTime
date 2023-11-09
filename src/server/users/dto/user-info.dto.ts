import type { User } from '../entities/user.entity';
import { DiscordUserInfoDto } from '../../discord-users/dto/discord-user-info.dto';

export class UserInfoDto {
  id: string;
  name: string;
  discordUsers: DiscordUserInfoDto[];
  maxTemplates: number;

  static from(user: User): UserInfoDto {
    const dto = new UserInfoDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.discordUsers = user.discordUsers.map((du) =>
      DiscordUserInfoDto.from(du),
    );
    dto.maxTemplates = user.getMaxTemplateCount();
    return dto;
  }
}
