import type { User as AppUser } from '../src/server/users/entities/user.entity';

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
