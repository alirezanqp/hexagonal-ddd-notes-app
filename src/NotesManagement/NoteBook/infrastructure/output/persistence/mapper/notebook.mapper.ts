import { Injectable } from '@nestjs/common';
import { NotebookPersistenceModel } from '../model/notebook.persistence.model';
import { Notebook } from 'src/NotesManagement/NoteBook/domain/notebook';

@Injectable()
export class NotebookMapper {
  toDomain(notebookPersistenceModel: NotebookPersistenceModel): Notebook {
    const notebook = new Notebook();

    notebook.id = notebookPersistenceModel.id;
    notebook.name = notebookPersistenceModel.name;
    notebook.userId = notebookPersistenceModel.userId;
    notebook.noteIds = notebookPersistenceModel.noteIds || [];
    notebook.createdAt = notebookPersistenceModel.createdAt;
    notebook.updatedAt = notebookPersistenceModel.updatedAt;

    return notebook;
  }

  toPersistenceModel(notebook: Notebook): NotebookPersistenceModel {
    const notebookPersistenceModel = new NotebookPersistenceModel();

    notebookPersistenceModel.id = notebook.id;
    notebookPersistenceModel.name = notebook.name;
    notebookPersistenceModel.userId = notebook.userId;
    notebookPersistenceModel.noteIds = notebook.noteIds;
    notebookPersistenceModel.createdAt = notebook.createdAt;
    notebookPersistenceModel.updatedAt = notebook.updatedAt;

    return notebookPersistenceModel;
  }
}
