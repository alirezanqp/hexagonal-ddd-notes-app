import { Logger, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NoteRepository } from 'src/NotesManagement/Note/application/ports/note.repository';
import { ArchiveNoteCommand } from './archive-note.command';
import {
  NoteNotFound,
  UnauthorizedNoteAccess,
} from 'src/NotesManagement/Note/domain/exceptions/note.exceptions';

@CommandHandler(ArchiveNoteCommand)
export class ArchiveNoteUseCase implements ICommandHandler<ArchiveNoteCommand> {
  private readonly logger = new Logger(ArchiveNoteUseCase.name);

  constructor(
    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(command: ArchiveNoteCommand): Promise<void> {
    const { noteId, userId, ...metadata } = command;

    this.logger.log(`
      New ArchiveNoteCommand executed for user: ${userId}
      command: ${JSON.stringify(metadata)}
    `);

    const note = await this.noteRepository.loadById(noteId);

    if (!note) {
      throw new NoteNotFound();
    }

    if (note.userId !== userId) {
      throw new UnauthorizedNoteAccess();
    }

    note.archive();

    await this.noteRepository.save(note);

    this.logger.log(`
      ArchiveNoteCommand success executed with command id: ${command.id}
      Note archived: ${note.id}
    `);
  }
}
