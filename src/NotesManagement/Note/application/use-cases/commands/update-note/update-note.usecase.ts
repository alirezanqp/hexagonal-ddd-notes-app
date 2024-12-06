import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { UpdateNoteCommand } from './update-note.command';
import {
  NoteNotFound,
  UnauthorizedNoteAccess,
} from 'src/NotesManagement/Note/domain/exceptions/note.exceptions';
import { NoteRepository } from '../../../ports/note.repository';

@CommandHandler(UpdateNoteCommand)
export class UpdateNoteUseCase implements ICommandHandler<UpdateNoteCommand> {
  private readonly logger = new Logger(UpdateNoteUseCase.name);

  constructor(
    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(command: UpdateNoteCommand): Promise<void> {
    const { noteId, title, content, userId, ...metadata } = command;

    this.logger.log(`
      New UpdateNoteCommand executed
      Note ID: ${noteId}
      command: ${JSON.stringify(metadata)}
    `);

    const note = await this.noteRepository.loadById(noteId);
    if (!note) {
      throw new NoteNotFound();
    }

    if (note.userId !== userId) {
      throw new UnauthorizedNoteAccess();
    }

    note.update(title, content);

    await this.noteRepository.save(note);

    this.logger.log(`
      UpdateNoteCommand successfully executed
      Note ID: ${noteId}
      Command ID: ${command.id}
    `);
  }
}
