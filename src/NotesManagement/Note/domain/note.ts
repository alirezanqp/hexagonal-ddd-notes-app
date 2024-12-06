import { AggregateRoot } from '@common/domain/aggregate-root';
import { randomUUID } from 'node:crypto';
import {
  NoteCreated,
  NoteUpdated,
  NoteTagsUpdated,
  NoteArchived,
  NoteMovedToNotebook,
} from './events/note.events';

export interface CreateNoteProps {
  title: string;
  content: string;
  userId: string;
  notebookId?: string;
  tags?: string[];
}

export class Note extends AggregateRoot {
  id: string;
  title: string;
  content: string;
  userId: string;
  notebookId?: string;
  tags: string[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;

  static create(props: CreateNoteProps): Note {
    const note = new Note();

    note.id = randomUUID();
    note.title = props.title;
    note.content = props.content;
    note.userId = props.userId;
    note.notebookId = props.notebookId;
    note.tags = props.tags || [];
    note.isArchived = false;
    note.createdAt = new Date();
    note.updatedAt = new Date();
    note.archivedAt = null;

    note.addEvent(new NoteCreated(note));

    return note;
  }

  update(title: string, content: string): void {
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();

    this.addEvent(
      new NoteUpdated({
        noteId: this.id,
        title: this.title,
        content: this.content,
      }),
    );
  }

  updateTags(tags: string[]): void {
    this.tags = tags;
    this.updatedAt = new Date();

    this.addEvent(
      new NoteTagsUpdated({
        noteId: this.id,
        tags: this.tags,
      }),
    );
  }

  archive(): void {
    if (!this.isArchived) {
      this.isArchived = true;
      this.archivedAt = new Date();
      this.updatedAt = new Date();

      this.addEvent(
        new NoteArchived({
          noteId: this.id,
          archivedAt: this.archivedAt,
        }),
      );
    }
  }

  unarchive(): void {
    if (this.isArchived) {
      this.isArchived = false;
      this.archivedAt = null;
      this.updatedAt = new Date();

      this.addEvent(new NoteCreated(this));
    }
  }

  moveToNotebook(notebookId: string): void {
    this.notebookId = notebookId;
    this.updatedAt = new Date();

    this.addEvent(
      new NoteMovedToNotebook({ notebookId: this.notebookId, noteId: this.id }),
    );
  }
}
