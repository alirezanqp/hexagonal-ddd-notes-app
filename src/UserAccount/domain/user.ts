import { AggregateRoot } from '@common/domain/aggregate-root';
import { NewUserRegistered } from './events/new-user-registered';
import { UserPasswordChanged } from './events/user-password-changed';
import { UserEmailChanged } from './events/user-email-changed';
import { UserNameUpdated } from './events/user-name-updated';
import { UserLoggedIn } from './events/user-logged-in';
import { randomUUID } from 'node:crypto';

export class User extends AggregateRoot {
  id: string;
  name: string;
  email: string;
  password: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;

  static register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): User {
    const user = new User();

    user.id = randomUUID();

    user.name = name;
    user.email = email;
    user.password = password;

    user.createdAt = new Date();
    user.updatedAt = new Date();

    user.addEvent(new NewUserRegistered(user));

    return user;
  }

  login(): void {
    this.lastLoginAt = new Date();

    this.addEvent(new UserLoggedIn({ userId: this.id }));
  }

  changePassword(password: string): void {
    this.password = password;
    this.updatedAt = new Date();

    this.addEvent(
      new UserPasswordChanged({ userId: this.id, newPassword: password }),
    );
  }

  changeEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();

    this.addEvent(new UserEmailChanged({ userId: this.id, newEmail: email }));
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();

    this.addEvent(new UserNameUpdated({ userId: this.id, newName: name }));
  }
}
