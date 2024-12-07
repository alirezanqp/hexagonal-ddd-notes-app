import { DomainEvent } from '@common/domain/domain-event';
import { Note } from '../note';

export class NoteCreated extends DomainEvent {
  constructor(note: Note) {
    super(note, NoteCreated.name);
  }
}

export class NoteUpdated extends DomainEvent {
  constructor(note: { noteId: string; title: string; content: string }) {
    super(note, NoteUpdated.name);
  }
}

export class NoteArchived extends DomainEvent {
  constructor(note: { noteId: string; archivedAt: Date }) {
    super(note, NoteArchived.name);
  }
}

export class NoteTagsUpdated extends DomainEvent {
  constructor(note: { noteId: string; tags: string[] }) {
    super(note, NoteTagsUpdated.name);
  }
}

export class NoteMovedToNotebook extends DomainEvent {
  constructor(note: { notebookId: string; noteId: string }) {
    super(note, NoteMovedToNotebook.name);
  }
}
