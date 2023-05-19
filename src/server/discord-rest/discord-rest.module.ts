import { Module } from '@nestjs/common';
import { DiscordRestService } from './discord-rest.service';

@Module({
  providers: [DiscordRestService],
  exports: [DiscordRestService],
})
export class DiscordRestModule {}
