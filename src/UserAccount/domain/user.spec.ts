import { User } from './user';
import { NewUserRegistered } from './events/new-user-registered';
import { UserPasswordChanged } from './events/user-password-changed';
import { UserEmailChanged } from './events/user-email-changed';
import { UserNameUpdated } from './events/user-name-updated';
import { UserLoggedIn } from './events/user-logged-in';

describe('User', () => {
  it('should register a new user and add a NewUserRegistered event', () => {
    const user = User.register({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('securepassword');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.getEvents().length).toBe(1);

    const event = user.getEvents()[0] as NewUserRegistered;
    expect(event).toBeInstanceOf(NewUserRegistered);
    expect(event.data['id']).toBe(user.id);
    expect(event.data['name']).toBe('John Doe');
    expect(event.data['email']).toBe('john.doe@example.com');
  });

  it('should change the user password and add a UserPasswordChanged event', () => {
    const user = new User();
    user.password = 'oldpassword';
    user.updatedAt = new Date();

    user.changePassword('newpassword');

    expect(user.password).toBe('newpassword');
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.getEvents().length).toBe(1);

    const event = user.getEvents()[0] as UserPasswordChanged;
    expect(event).toBeInstanceOf(UserPasswordChanged);
    expect(event.data['userId']).toBe(user.id);
    expect(event.data['newPassword']).toBe('newpassword');
  });

  it('should change the user email and add a UserEmailChanged event', () => {
    const user = new User();
    user.email = 'old.email@example.com';
    user.updatedAt = new Date();

    user.changeEmail('new.email@example.com');

    expect(user.email).toBe('new.email@example.com');
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.getEvents().length).toBe(1);

    const event = user.getEvents()[0] as UserEmailChanged;
    expect(event).toBeInstanceOf(UserEmailChanged);
    expect(event.data['userId']).toBe(user.id);
    expect(event.data['newEmail']).toBe('new.email@example.com');
  });

  it('should update the user name and add a UserNameUpdated event', () => {
    const user = new User();
    user.name = 'Old Name';
    user.updatedAt = new Date();

    user.updateName('New Name');

    expect(user.name).toBe('New Name');
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.getEvents().length).toBe(1);

    const event = user.getEvents()[0] as UserNameUpdated;
    expect(event).toBeInstanceOf(UserNameUpdated);
    expect(event.data['userId']).toBe(user.id);
    expect(event.data['newName']).toBe('New Name');
  });

  it('should set lastLoginAt and add a UserLoggedIn event', () => {
    const user = new User();

    user.login();

    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(user.getEvents().length).toBe(1);

    const event = user.getEvents()[0] as UserLoggedIn;
    expect(event).toBeInstanceOf(UserLoggedIn);
    expect(event.data['userId']).toBe(user.id);
  });
});
