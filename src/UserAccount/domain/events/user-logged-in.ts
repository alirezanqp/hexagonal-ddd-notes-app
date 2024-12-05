import { DomainEvent } from '@common/domain/domain-event';

export class UserLoggedIn extends DomainEvent {
  constructor(data: { userId: string }) {
    super(data, UserLoggedIn.name);
  }
}
