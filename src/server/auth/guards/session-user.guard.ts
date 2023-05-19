import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { DiscordUsersService } from '../../discord-users/discord-users.service';

@Injectable()
export class SessionUserGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly discordUsersService: DiscordUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;
    if (!userId) {
      return false;
    }

    // Retrieve user information from the users service
    const user = await this.usersService.findOne(userId);
    if (!user) {
      return false;
    }

    // Store the user object in the request for later use
    request.user = user;
    return true;
  }
}
