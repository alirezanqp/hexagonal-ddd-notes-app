import { Note } from 'src/NotesManagement/Note/domain/note';

export interface NoteRepository {
  save(note: Note): Promise<void>;
  loadById(id: string): Promise<Note | null>;
}

export const NoteRepository = Symbol('NoteRepository');
