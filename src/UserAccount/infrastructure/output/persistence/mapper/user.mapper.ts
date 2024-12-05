import { Injectable } from '@nestjs/common';
import { User } from 'src/UserAccount/domain/user';
import { UserPersistenceModel } from '../model/user.persistence.model';

@Injectable()
export class UserMapper {
  toDomain(userPersistenceModel: UserPersistenceModel): User {
    const user = new User();

    user.id = userPersistenceModel.id;
    user.name = userPersistenceModel.name;
    user.email = userPersistenceModel.email;
    user.password = userPersistenceModel.password;
    user.lastLoginAt = userPersistenceModel.lastLoginAt;
    user.createdAt = userPersistenceModel.createdAt;
    user.updatedAt = userPersistenceModel.updatedAt;

    return user;
  }

  toPersistenceModel(user: User): UserPersistenceModel {
    const userPersistenceModel = new UserPersistenceModel();

    userPersistenceModel.id = user.id;
    userPersistenceModel.name = user.name;
    userPersistenceModel.email = user.email;
    userPersistenceModel.password = user.password;
    userPersistenceModel.lastLoginAt = user.lastLoginAt;
    userPersistenceModel.createdAt = user.createdAt;
    userPersistenceModel.updatedAt = user.updatedAt;

    return userPersistenceModel;
  }
}
