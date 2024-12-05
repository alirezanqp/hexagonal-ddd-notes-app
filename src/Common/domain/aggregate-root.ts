import { RequestContextService } from '@common/infrastructure/request-context/app-request.context';
import { Logger } from '@nestjs/common';
import { DomainEvent } from './domain-event';
import Entity from './entity';
import { Publisher } from '@common/application/ports/publisher.port';

export abstract class AggregateRoot extends Entity {
  private events: DomainEvent[] = [];

  /**
   * Adds an event to event list
   */
  protected addEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  /**
   * Get a list of all events
   */
  public getEvents(): DomainEvent[] {
    return [...this.events];
  }

  /**
   * Clears the event list
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Publishes all events
   */
  public async publishEvents(
    logger: Logger,
    publisher: Publisher,
  ): Promise<void> {
    await Promise.all(
      this.events.map(async (event) => {
        if (event.isExternalEvent) {
          logger.debug(
            `[${RequestContextService.getRequestId()}] "${
              event.constructor.name
            }" event published for aggregate ${this.constructor.name} : ${
              this.id
            }`,
          );
          return publisher.publish(event.constructor.name, event);
        }
      }),
    );
    this.clearEvents();
  }
}
