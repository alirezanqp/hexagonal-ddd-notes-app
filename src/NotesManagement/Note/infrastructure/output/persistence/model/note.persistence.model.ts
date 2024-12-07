import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotePersistenceDocument = HydratedDocument<NotePersistenceModel>;
export const NoteCollectionName = 'notes';

@Schema({ collection: NoteCollectionName })
export class NotePersistenceModel {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  userId: string;

  @Prop()
  notebookId?: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  isArchived: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  archivedAt: Date | null;
}

export const NotePersistenceSchema =
  SchemaFactory.createForClass(NotePersistenceModel);
