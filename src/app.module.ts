import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestContextModule } from 'nestjs-request-context';
import { NestjsEventEmitterModule } from '@common/infrastructure/event-publisher/nest-event-emitter.publisher.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@common/infrastructure/request-context/context.interceptor';
import { UserAccountModule } from './UserAccount/user-account.module';
import { NotesManagementModule } from './NotesManagement/notes-management.module';
import { CqrsModule } from '@nestjs/cqrs';

const interceptors: Provider[] = [
  { provide: APP_INTERCEPTOR, useClass: ContextInterceptor },
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://alirezanqp:zw9OcVOMvSp3a01K@cluster0.yzcot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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
