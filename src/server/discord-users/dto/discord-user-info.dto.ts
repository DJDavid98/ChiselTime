import type { DiscordUser } from '../entities/discord-user.entity';

export class DiscordUserInfoDto {
  id: string;
  name: string;
  avatarUrl: string;

  private static cdnBaseUrl = 'https://cdn.discordapp.com';

  static from(du: DiscordUser): DiscordUserInfoDto {
    const dto = new DiscordUserInfoDto();
    dto.id = du.id;
    dto.name = du.displayName ?? du.name;
    dto.avatarUrl = DiscordUserInfoDto.getAvatarUrl(du);
    return dto;
  }

  private static getAvatarUrl(du: DiscordUser) {
    if (du.avatar) {
      const avatarFileExtension = du.avatar.startsWith('a_') ? 'gif' : 'png';
      return `${DiscordUserInfoDto.cdnBaseUrl}/avatars/${du.id}/${du.avatar}.${avatarFileExtension}`;
    }

    // Default avatar logic
    const defaultAvatarFileName =
      (du.discriminator === 0
        ? // User is migrated to new username system
          parseInt(du.id, 10) >> 22
        : // User is on previous username system
          du.discriminator) % 5;
    return `/embed/avatars/${defaultAvatarFileName}.png`;
  }
}
