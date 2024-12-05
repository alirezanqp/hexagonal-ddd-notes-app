import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { LoginUserCommand } from './login-user.command';
import { UserRepository } from '../../../ports/user.repository.port';
import { Hash } from '../../../ports/hash.port';
import { Token } from 'src/UserAccount/application/ports/token.port';
import {
  CredentialsNotValid,
  EmailNotFound,
} from 'src/UserAccount/domain/exceptions/user.exceptions';
import { User } from 'src/UserAccount/domain/user';

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserUseCase.name);

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    @Inject(Hash)
    private readonly hash: Hash,

    @Inject(Token)
    private readonly token: Token,
  ) {}

  async execute(command: LoginUserCommand): Promise<string> {
    const { email, password, ...metadata } = command;

    this.logger.log(`
        new LoginUserCommand executed with email: ${email}
        command: ${JSON.stringify(metadata)}
        `);

    const user = await this.loadUserByEmailOrThrow(email);
    await this.validateCredentials(password, user.password);

    user.login();

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.token.create(JSON.stringify(tokenPayload));

    await this.userRepository.save(user);

    this.logger.log(`
        LoginUserCommand success executed with command id: ${command.id}
        `);

    return token;
  }

  private async loadUserByEmailOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.loadByEmail(email);

    if (!user) {
      throw new EmailNotFound();
    }

    return user;
  }

  private async validateCredentials(
    password: string,
    hash: string,
  ): Promise<void> {
    const isValid = await this.hash.compare(password, hash);

    if (!isValid) {
      throw new CredentialsNotValid();
    }
  }
}
