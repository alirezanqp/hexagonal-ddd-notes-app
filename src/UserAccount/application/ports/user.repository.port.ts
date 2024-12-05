import { User } from 'src/UserAccount/domain/user';

export interface UserRepository {
  save(user: User): Promise<void>;
  loadByEmail(email: string): Promise<User | null>;
}

export const UserRepository = Symbol('UserRepository');
