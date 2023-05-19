import { Module } from '@nestjs/common';
import { PatreonUsersService } from './patreon-users.service';

@Module({
  controllers: [],
  providers: [PatreonUsersService],
})
export class PatreonUsersModule {}
