import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestContextModule } from 'nestjs-request-context';
import { NestjsEventEmitterModule } from '@common/infrastructure/event-publisher/nest-event-emitter.publisher.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@common/infrastructure/request-context/context.interceptor';
import { UserAccountModule } from './UserAccount/user-account.module';

const interceptors: Provider[] = [
  { provide: APP_INTERCEPTOR, useClass: ContextInterceptor },
];

@Module({
  imports: [
    MongooseModule.forRoot(''),
    RequestContextModule,
    NestjsEventEmitterModule,

    // Domain Modules
    UserAccountModule,
  ],
  providers: [...interceptors],
})
export class AppModule {}
