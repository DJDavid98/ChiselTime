import { Module } from '@nestjs/common';
import { PatreonUsersService } from './patreon-users.service';

@Module({
  controllers: [],
  providers: [PatreonUsersService],
  exports: [PatreonUsersService],
})
export class PatreonUsersModule {}
