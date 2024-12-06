import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { AddNoteToNotebookCommand } from './add-note-to-notebook.command';

import {
  NotebookNotFound,
  UnauthorizedNotebookAccess,
} from '../../../../domain/exceptions/notebook.exceptions';
import { NoteRepository } from 'src/NotesManagement/Note/application/ports/note.repository';
import { NoteNotFound } from 'src/NotesManagement/Note/domain/exceptions/note.exceptions';
import { NotebookRepository } from '../../../ports/notebook.repository';

@CommandHandler(AddNoteToNotebookCommand)
export class AddNoteToNotebookUseCase
  implements ICommandHandler<AddNoteToNotebookCommand>
{
  private readonly logger = new Logger(AddNoteToNotebookUseCase.name);

  constructor(
    @Inject(NotebookRepository)
    private readonly notebookRepository: NotebookRepository,

    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(command: AddNoteToNotebookCommand): Promise<void> {
    const { notebookId, noteId, userId, ...metadata } = command;

    this.logger.log(`
      New AddNoteToNotebookCommand executed
      Notebook ID: ${notebookId}
      Note ID: ${noteId}
      command: ${JSON.stringify(metadata)}
    `);

    const notebook = await this.notebookRepository.loadById(notebookId);
    if (!notebook) {
      throw new NotebookNotFound();
    }

    if (notebook.userId !== userId) {
      throw new UnauthorizedNotebookAccess();
    }

    const note = await this.noteRepository.loadById(noteId);
    if (!note) {
      throw new NoteNotFound();
    }

    if (note.userId !== userId) {
      throw new UnauthorizedNotebookAccess();
    }

    notebook.addNote(noteId);

    await this.notebookRepository.save(notebook);

    this.logger.log(`
      AddNoteToNotebookCommand successfully executed
      Notebook ID: ${notebookId}
      Note ID: ${noteId}
      Command ID: ${command.id}
    `);
  }
}
