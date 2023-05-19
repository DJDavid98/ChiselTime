import { PartialType } from '@nestjs/swagger';
import { CreateDiscordUserDto } from './create-discord-user.dto';

export class UpdateDiscordUserDto extends PartialType(CreateDiscordUserDto) {
  id?: never;
}
