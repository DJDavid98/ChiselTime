import { User } from '../users/entities/user.entity';

export interface AppUserValidator {
  validate: (accessToken: string, refreshToken: string) => Promise<User>;
}
