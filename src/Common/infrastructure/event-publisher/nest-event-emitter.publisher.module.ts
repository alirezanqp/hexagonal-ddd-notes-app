import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { NestjsEventPublisher } from './nest-event-emitter.publisher';
import { Publisher } from '@common/application/ports/publisher.port';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    {
      provide: Publisher,
      useClass: NestjsEventPublisher,
    },
  ],
  exports: [
    {
      provide: Publisher,
      useClass: NestjsEventPublisher,
    },
  ],
})
export class NestjsEventEmitterModule {}
