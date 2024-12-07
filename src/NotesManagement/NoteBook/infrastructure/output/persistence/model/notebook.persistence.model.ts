import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotebookPersistenceDocument =
  HydratedDocument<NotebookPersistenceModel>;
export const NotebookCollectionName = 'notebooks';

@Schema({ collection: NotebookCollectionName })
export class NotebookPersistenceModel {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  userId: string;

  @Prop()
  noteIds: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const NotebookPersistenceSchema = SchemaFactory.createForClass(
  NotebookPersistenceModel,
);
