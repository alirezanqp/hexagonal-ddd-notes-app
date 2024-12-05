import { DomainEvent } from '@common/domain/domain-event';

export class UserNameUpdated extends DomainEvent {
  constructor(data: { userId: string; newName: string }) {
    super(data, UserNameUpdated.name);
  }
}
