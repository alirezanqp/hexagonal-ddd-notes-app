import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { Note } from 'src/NotesManagement/Note/domain/note';
import { Cache } from '../../../ports/cache.port';
import { NoteRepository } from '../../../ports/note.repository';
import { GetNoteByIdQuery } from './get-by-id.query';
import {
  UnauthorizedNoteAccess,
  NoteNotFound,
} from 'src/NotesManagement/Note/domain/exceptions/note.exceptions';

@QueryHandler(GetNoteByIdQuery)
export class GetNoteByIdUseCase implements IQueryHandler<GetNoteByIdQuery> {
  private readonly logger = new Logger(GetNoteByIdUseCase.name);

  constructor(
    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,

    @Inject(Cache)
    private readonly cache: Cache,
  ) {}

  async execute(query: GetNoteByIdQuery): Promise<Note> {
    const { noteId, userId, ...metadata } = query;

    this.logger.log(`
      New GetNoteByIdQuery executed for user: ${userId}
      query: ${JSON.stringify(metadata)}
    `);

    // Try to get from cache first
    const cacheKey = this.getNotByIdCacheKeyGenerator(noteId);
    const cachedNote = await this.cache.get<Note>(cacheKey);

    if (cachedNote) {
      if (cachedNote.userId !== userId) {
        throw new UnauthorizedNoteAccess();
      }
      return cachedNote;
    }

    const note = await this.noteRepository.loadById(noteId);

    if (!note) {
      throw new NoteNotFound();
    }

    if (note.userId !== userId) {
      throw new UnauthorizedNoteAccess();
    }

    // Cache the note
    const cacheTtl = 60 * 60; // 1h
    await this.cache.set(cacheKey, note, cacheTtl);

    return note;
  }

  private getNotByIdCacheKeyGenerator(noteId: string): string {
    return `note:${noteId}`;
  }
}
