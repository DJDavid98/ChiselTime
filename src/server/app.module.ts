import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewModule } from './view/view.module';
import { StateModule } from './state/state.module';
import { SharedModule } from './shared.module';
import { MessageUpdatesModule } from './message-updates/message-updates.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DiscordUsersModule } from './discord-users/discord-users.module';
import { PatreonUsersModule } from './patreon-users/patreon-users.module';
import { MessageTemplatesModule } from './message-templates/message-templates.module';
import { DiscordRestModule } from './discord-rest/discord-rest.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  imports: [
    AuthModule,
    DiscordRestModule,
    DiscordUsersModule,
    MessageTemplatesModule,
    MessageUpdatesModule,
    PatreonUsersModule,
    SharedModule,
    StateModule,
    UsersModule,
    ViewModule,
    UserSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
