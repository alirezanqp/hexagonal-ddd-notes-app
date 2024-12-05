import { DomainEvent } from '@common/domain/domain-event';

export class UserPasswordChanged extends DomainEvent {
  constructor(data: { userId: string; newPassword: string }) {
    super(data, UserPasswordChanged.name);
  }
}
