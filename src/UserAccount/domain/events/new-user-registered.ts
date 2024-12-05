import { DomainEvent } from '@common/domain/domain-event';
import { User } from '../user';

export class NewUserRegistered extends DomainEvent {
  isExternalEvent = true;

  constructor(user: User) {
    super(user, NewUserRegistered.name);
  }
}
