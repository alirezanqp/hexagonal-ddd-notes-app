import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPersistenceDocument = HydratedDocument<UserPersistenceModel>;
export const UserCollectionName = 'users';

@Schema({ collection: UserCollectionName })
export class UserPersistenceModel {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserPersistenceSchema =
  SchemaFactory.createForClass(UserPersistenceModel);
