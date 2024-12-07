import { AggregateRoot } from '@common/domain/aggregate-root';
import { randomUUID } from 'node:crypto';
import {
  NotebookCreated,
  NotebookRenamed,
  NoteAdded,
  NoteRemoved,
} from './events/notebook.events';

export interface CreateNotebookProps {
  name: string;
  userId: string;
  noteIds?: string[];
}

export class Notebook extends AggregateRoot {
  id: string;
  name: string;
  userId: string;
  noteIds: string[];
  createdAt: Date;
  updatedAt: Date;

  static create(props: CreateNotebookProps): Notebook {
    const notebook = new Notebook();

    notebook.id = randomUUID();
    notebook.name = props.name;
    notebook.userId = props.userId;
    notebook.noteIds = props?.noteIds || [];
    notebook.createdAt = new Date();
    notebook.updatedAt = new Date();

    notebook.addEvent(new NotebookCreated(notebook));

    return notebook;
  }

  rename(newName: string): void {
    this.name = newName;
    this.updatedAt = new Date();

    this.addEvent(
      new NotebookRenamed({
        notebookId: this.id,
        newName: this.name,
      }),
    );
  }

  addNote(noteId: string): void {
    if (!this.noteIds.includes(noteId)) {
      this.noteIds.push(noteId);
      this.updatedAt = new Date();

      this.addEvent(
        new NoteAdded({
          notebookId: this.id,
          noteId: noteId,
        }),
      );
    }
  }

  removeNote(noteId: string): void {
    const index = this.noteIds.indexOf(noteId);
    if (index !== -1) {
      this.noteIds.splice(index, 1);
      this.updatedAt = new Date();

      this.addEvent(
        new NoteRemoved({
          notebookId: this.id,
          noteId: noteId,
        }),
      );
    }
  }
}
