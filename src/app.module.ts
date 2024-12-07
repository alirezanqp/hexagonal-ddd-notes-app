import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestContextModule } from 'nestjs-request-context';
import { NestjsEventEmitterModule } from '@common/infrastructure/event-publisher/nest-event-emitter.publisher.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@common/infrastructure/request-context/context.interceptor';
import { UserAccountModule } from './UserAccount/user-account.module';
import { NotesManagementModule } from './NotesManagement/notes-management.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ExceptionInterceptor } from '@common/infrastructure/interceptors/exception.interceptor';
import { AllExceptionsFilter } from '@common/infrastructure/exception-filters/filters';

const interceptors: Provider[] = [
  { provide: APP_INTERCEPTOR, useClass: ContextInterceptor },
  { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:2dv6WbOvEdg8KVMTvO1msjb4@monte-rosa.liara.cloud:33688/my-app?authSource=admin&replicaSet=rs0&directConnection=true',
    ),
    CqrsModule,
    RequestContextModule,
    NestjsEventEmitterModule,

    // Domain Modules
    UserAccountModule,
    NotesManagementModule,
  ],
  providers: [...interceptors],
})
export class AppModule {}
