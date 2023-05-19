import type { PatreonUser } from '../entities/patreon-user.entity';

export class PatreonUserInfoDto {
  id: string;
  name: string;
  avatarUrl: string | null;

  static from(pu: PatreonUser): PatreonUserInfoDto {
    const dto = new PatreonUserInfoDto();
    dto.id = pu.id;
    dto.name = pu.name;
    dto.avatarUrl = pu.avatar;
    return dto;
  }
}
