import { DomainEvent } from '@common/domain/domain-event';

export class UserEmailChanged extends DomainEvent {
  constructor(data: { userId: string; newEmail: string }) {
    super(data, UserEmailChanged.name);
  }
}
