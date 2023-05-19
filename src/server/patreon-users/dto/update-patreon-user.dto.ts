import { PartialType } from '@nestjs/swagger';
import { CreatePatreonUserDto } from './create-patreon-user.dto';

export class UpdatePatreonUserDto extends PartialType(CreatePatreonUserDto) {}
