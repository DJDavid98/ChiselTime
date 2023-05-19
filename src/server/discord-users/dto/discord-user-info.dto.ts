import { DiscordUser } from '../entities/discord-user.entity';

export class DiscordUserInfoDto {
  id: string;
  name: string;
  avatarUrl: string;

  static from(du: DiscordUser): DiscordUserInfoDto {
    const dto = new DiscordUserInfoDto();
    dto.id = du.id;
    dto.name = `${du.name}#${du.discriminator}`;
    dto.avatarUrl = `https://cdn.discordapp.com${
      du.avatar
        ? `/avatars/${du.id}/${du.avatar}.${
            du.avatar.startsWith('a_') ? 'gif' : 'png'
          }`
        : `/embed/avatars/${Number(du.discriminator) % 5}.png`
    }`;
    return dto;
  }
}
