import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { UserRepository } from 'src/UserAccount/application/ports/user.repository.port';
import { User } from 'src/UserAccount/domain/user';
import {
  UserCollectionName,
  UserPersistenceModel,
} from './model/user.persistence.model';
import { UserMapper } from './mapper/user.mapper';
import { NewUserRegistered } from 'src/UserAccount/domain/events/new-user-registered';
import { UserLoggedIn } from 'src/UserAccount/domain/events/user-logged-in';
import { UserEmailChanged } from 'src/UserAccount/domain/events/user-email-changed';
import { UserPasswordChanged } from 'src/UserAccount/domain/events/user-password-changed';
import { UserNameUpdated } from 'src/UserAccount/domain/events/user-name-updated';

@Injectable()
export class MongodbUserRepository implements UserRepository {
  private readonly logger = new Logger(MongodbUserRepository.name);

  constructor(
    @InjectModel(UserCollectionName)
    private userModel: Model<UserPersistenceModel>,

    private readonly userMapper: UserMapper,
  ) {}

  async save(user: User): Promise<void> {
    const session = await this.userModel.startSession();

    try {
      this.logger.log(`Saving user with ID: ${user.id}`);

      await session.withTransaction(async () => {
        const events = user.getEvents();
        const userPersistenceModel = this.userMapper.toPersistenceModel(user);

        for (const event of events) {
          this.logger.debug(`Processing event: ${event.constructor.name}`);

          if (event instanceof NewUserRegistered) {
            this.logger.log(`Creating new user: ${userPersistenceModel.email}`);
            await this.createUser(userPersistenceModel, session);
          }

          if (
            event instanceof UserLoggedIn ||
            event instanceof UserEmailChanged ||
            event instanceof UserPasswordChanged ||
            event instanceof UserNameUpdated
          ) {
            this.logger.log(`Updating user: ${userPersistenceModel.email}`);
            await this.updateUser(userPersistenceModel, session);
          }
        }
      });

      this.logger.log(
        `User save transaction completed successfully for ID: ${user.id}`,
      );
    } catch (error) {
      this.logger.error(`Failed to save user: ${error}`);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async loadByEmail(email: string): Promise<User | null> {
    try {
      this.logger.log(`Loading user by email: ${email}`);

      const user = await this.userModel.findOne({ email });

      if (user) {
        this.logger.debug(`User found for email: ${email}`);
        return this.userMapper.toDomain(user);
      }

      this.logger.log(`No user found for email: ${email}`);
      return null;
    } catch (error) {
      this.logger.error(`Error loading user by email: ${error}`);
      throw error;
    }
  }

  private async createUser(
    userPersistenceModel: UserPersistenceModel,
    session: ClientSession,
  ): Promise<void> {
    try {
      await this.userModel.create([userPersistenceModel], { session });
      this.logger.log(`User created: ${userPersistenceModel.email}`);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      throw error;
    }
  }

  private async updateUser(
    userPersistenceModel: UserPersistenceModel,
    session: ClientSession,
  ): Promise<void> {
    try {
      const result = await this.userModel.updateOne(
        { _id: userPersistenceModel.id },
        userPersistenceModel,
        { session },
      );

      if (result.modifiedCount > 0) {
        this.logger.log(
          `User updated successfully: ${userPersistenceModel.email}`,
        );
      } else {
        this.logger.warn(
          `No documents were modified for user: ${userPersistenceModel.email}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to update user: ${error}`);
      throw error;
    }
  }
}
