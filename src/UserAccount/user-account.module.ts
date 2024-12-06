import { Module, Provider } from '@nestjs/common';
import { RegisterUserUseCase } from './application/use-cases/commands/register-user/register-user.usecase';
import { LoginUserUseCase } from './application/use-cases/commands/login-user/login-user.usecase';
import { UserRepository } from './application/ports/user.repository.port';
import { MongodbUserRepository } from './infrastructure/output/persistence/mongodb.user.repository';
import { UserMapper } from './infrastructure/output/persistence/mapper/user.mapper';
import { UserHttpController } from './infrastructure/input/http/user.http.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserCollectionName,
  UserPersistenceSchema,
} from './infrastructure/output/persistence/model/user.persistence.model';
import { Hash } from './application/ports/hash.port';
import { BcryptHash } from './infrastructure/output/bcrypt.hash';
import { Token } from './application/ports/token.port';
import { JwtToken } from './infrastructure/output/jwt.token';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

const commands = [RegisterUserUseCase, LoginUserUseCase];

const infrastructure: Provider[] = [
  { provide: UserRepository, useClass: MongodbUserRepository },
  { provide: Hash, useClass: BcryptHash },
  { provide: Token, useClass: JwtToken },
];

const mapper = [UserMapper];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: UserCollectionName, schema: UserPersistenceSchema },
    ]),
    JwtModule.register({
      secret: 'super-secret',
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserHttpController],
  providers: [...commands, ...infrastructure, ...mapper],
})
export class UserAccountModule {}
