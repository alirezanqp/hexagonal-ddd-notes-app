import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { RegisterUserCommand } from './register-user.command';
import { UserRepository } from '../../../ports/user.repository.port';
import { Hash } from '../../../ports/hash.port';
import { EmailAlreadyExists } from 'src/UserAccount/domain/exceptions/user.exceptions';
import { User } from 'src/UserAccount/domain/user';

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  private readonly logger = new Logger(RegisterUserUseCase.name);

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    @Inject(Hash)
    private readonly hash: Hash,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { name, email, password, ...metadata } = command;

    this.logger.log(`
        new RegisterUserCommand executed with email: ${email}
        command: ${JSON.stringify(metadata)}
        `);

    await this.ensureUserEmailAlreadyNotExists(email);

    const user = User.register({
      name,
      email,
      password: await this.hashCredentials(password),
    });

    await this.userRepository.save(user);

    this.logger.log(`
        RegisterUserCommand success executed with command id: ${command.id}
        `);
  }

  private async ensureUserEmailAlreadyNotExists(email: string): Promise<void> {
    const user = await this.userRepository.loadByEmail(email);

    if (user) {
      throw new EmailAlreadyExists();
    }
  }

  private async hashCredentials(password: string): Promise<string> {
    return this.hash.hash(password);
  }
}
