import type { User } from '../entities/user.entity';
import { DiscordUserInfoDto } from '../../discord-users/dto/discord-user-info.dto';
import { PatreonUserInfoDto } from '../../patreon-users/dto/patreon-user-info.dto';

export class UserInfoDto {
  id: string;
  name: string;
  discordUsers: DiscordUserInfoDto[];
  patreonUsers: PatreonUserInfoDto[];
  maxTemplates: number;

  static from(user: User): UserInfoDto {
    const dto = new UserInfoDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.discordUsers = user.discordUsers.map((du) =>
      DiscordUserInfoDto.from(du),
    );
    dto.patreonUsers = user.discordUsers.reduce(
      (pu, du) =>
        du.patreonUser ? [...pu, PatreonUserInfoDto.from(du.patreonUser)] : pu,
      [] as PatreonUserInfoDto[],
    );
    dto.maxTemplates = user.getMaxTemplateCount();
    return dto;
  }
}
