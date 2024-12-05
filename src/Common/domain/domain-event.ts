import { RequestContextService } from '@common/infrastructure/request-context/app-request.context';
import { nanoid } from 'nanoid';

interface EventContext {
  requestId?: string;
  user?: {
    id?: string;
  };
}

export abstract class DomainEvent {
  readonly correlationId?: string;
  readonly userId?: string;
  readonly id!: string;

  constructor(
    public data: unknown,
    public eventName: string,
    public isExternalEvent: boolean = false,
    public occurredAt: Date = new Date(),
  ) {
    this.id = nanoid(8);

    const ctx: EventContext | undefined = RequestContextService.getContext();
    this.correlationId = ctx?.requestId;
    this.userId = ctx?.user?.id;
  }
}
