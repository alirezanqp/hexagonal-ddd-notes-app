import { DomainEvent } from '@common/domain/domain-event';
import { Notebook } from '../notebook';

export class NotebookCreated extends DomainEvent {
  constructor(notebook: Notebook) {
    super(notebook, NotebookCreated.name);
  }
}

export class NotebookRenamed extends DomainEvent {
  constructor(notebook: { notebookId: string; newName: string }) {
    super(notebook, NotebookRenamed.name);
  }
}

export class NoteAdded extends DomainEvent {
  constructor(notebook: { notebookId: string; noteId: string }) {
    super(notebook, NoteAdded.name);
  }
}

export class NoteRemoved extends DomainEvent {
  constructor(notebook: { notebookId: string; noteId: string }) {
    super(notebook, NoteRemoved.name);
  }
}
