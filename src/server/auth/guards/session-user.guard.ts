import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionUserGuard implements CanActivate {
  logger = new Logger(SessionUserGuard.name);

  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;
    if (!userId) {
      this.logger.debug('Session did not contain userId for request, denying');
      return false;
    }

    // Retrieve user information from the users service
    const user = await this.usersService.findOne(userId);
    if (!user) {
      this.logger.debug('User not found for userId in session, denying');
      return false;
    }

    // Store the user object in the request for later use
    this.logger.debug(`User found for userId ${userId} in session, allowing`);
    request.user = user;
    return true;
  }
}
