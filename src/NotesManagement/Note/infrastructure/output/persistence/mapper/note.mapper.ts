import { Injectable } from '@nestjs/common';
import { NotePersistenceModel } from '../model/note.persistence.model';
import { Note } from 'src/NotesManagement/Note/domain/note';

@Injectable()
export class NoteMapper {
  toDomain(notePersistenceModel: NotePersistenceModel): Note {
    const note = new Note();

    note.id = notePersistenceModel.id;
    note.title = notePersistenceModel.title;
    note.content = notePersistenceModel.content;
    note.userId = notePersistenceModel.userId;
    note.notebookId = notePersistenceModel.notebookId;
    note.tags = notePersistenceModel.tags || [];
    note.isArchived = notePersistenceModel.isArchived;
    note.createdAt = notePersistenceModel.createdAt;
    note.updatedAt = notePersistenceModel.updatedAt;
    note.archivedAt = notePersistenceModel.archivedAt;

    return note;
  }

  toPersistenceModel(note: Note): NotePersistenceModel {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      userId: note.userId,
      notebookId: note.notebookId,
      tags: note.tags,
      isArchived: note.isArchived,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      archivedAt: note.archivedAt,
    };
  }
}
