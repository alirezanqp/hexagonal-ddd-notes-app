import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Note } from 'src/NotesManagement/Note/domain/note';
import { NotebookRepository } from 'src/NotesManagement/NoteBook/application/ports/notebook.repository';
import { NoteRepository } from '../../../ports/note.repository';
import { CreateNoteCommand } from './create-note.command';
import {
  NotebookNotFound,
  UnauthorizedNotebookAccess,
} from 'src/NotesManagement/NoteBook/domain/exceptions/notebook.exceptions';

@CommandHandler(CreateNoteCommand)
export class CreateNoteUseCase implements ICommandHandler<CreateNoteCommand> {
  private readonly logger = new Logger(CreateNoteUseCase.name);

  constructor(
    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,

    @Inject(NotebookRepository)
    private readonly notebookRepository: NotebookRepository,
  ) {}

  async execute(command: CreateNoteCommand): Promise<string> {
    const { title, content, userId, notebookId, tags, ...metadata } = command;

    this.logger.log(`
      New CreateNoteCommand executed for user: ${userId}
      command: ${JSON.stringify(metadata)}
    `);

    if (notebookId) {
      const notebook = await this.notebookRepository.loadById(notebookId);
      if (!notebook) {
        throw new NotebookNotFound();
      }
      if (notebook.userId !== userId) {
        throw new UnauthorizedNotebookAccess();
      }
    }

    const note = Note.create({
      title,
      content,
      userId,
      notebookId,
      tags,
    });

    await this.noteRepository.save(note);

    if (notebookId) {
      const notebook = await this.notebookRepository.loadById(notebookId);
      notebook.addNote(note.id);
      await this.notebookRepository.save(notebook);
    }

    this.logger.log(`
      CreateNoteCommand successfully executed
      Note ID: ${note.id}
      Command ID: ${command.id}
    `);

    return note.id;
  }
}
