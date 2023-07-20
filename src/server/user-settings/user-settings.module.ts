import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from './entities/user-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSetting])],
  exports: [UserSettingsService],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
