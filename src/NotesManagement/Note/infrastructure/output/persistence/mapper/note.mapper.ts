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
    const notePersistenceModel = new NotePersistenceModel();

    notePersistenceModel.id = note.id;
    notePersistenceModel.title = note.title;
    notePersistenceModel.content = note.content;
    notePersistenceModel.userId = note.userId;
    notePersistenceModel.notebookId = note.notebookId;
    notePersistenceModel.tags = note.tags;
    notePersistenceModel.isArchived = note.isArchived;
    notePersistenceModel.createdAt = note.createdAt;
    notePersistenceModel.updatedAt = note.updatedAt;
    notePersistenceModel.archivedAt = note.archivedAt;

    return notePersistenceModel;
  }
}
