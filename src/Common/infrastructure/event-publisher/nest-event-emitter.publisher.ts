import { Publisher } from '@common/application/ports/publisher.port';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NestjsEventPublisher implements Publisher {
  constructor(private eventEmitter: EventEmitter2) {}

  async publish(eventName: string, event: unknown): Promise<void> {
    this.eventEmitter.emitAsync(eventName, event);
  }
}
