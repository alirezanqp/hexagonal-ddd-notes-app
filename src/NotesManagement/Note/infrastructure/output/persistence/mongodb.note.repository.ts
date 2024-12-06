import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import {
  NoteCreated,
  NoteUpdated,
  NoteTagsUpdated,
  NoteArchived,
  NoteMovedToNotebook,
} from 'src/NotesManagement/Note/domain/events/note.events';
import { Note } from 'src/NotesManagement/Note/domain/note';
import { NoteMapper } from 'src/NotesManagement/Note/infrastructure/output/persistence/mapper/note.mapper';
import {
  NoteCollectionName,
  NotePersistenceModel,
} from 'src/NotesManagement/Note/infrastructure/output/persistence/model/note.persistence.model';

@Injectable()
export class MongodbNoteRepository {
  private readonly logger = new Logger(MongodbNoteRepository.name);

  constructor(
    @InjectModel(NoteCollectionName)
    private noteModel: Model<NotePersistenceModel>,
    private readonly noteMapper: NoteMapper,
  ) {}

  async save(note: Note): Promise<void> {
    const session = await this.noteModel.startSession();

    try {
      this.logger.log(`Saving note with ID: ${note.id}`);

      await session.withTransaction(async () => {
        const events = note.getEvents();

        for (const event of events) {
          await this.handleEvent(event, session);
        }

        // Clear the events after they are processed
        note.clearEvents();
      });

      this.logger.log(
        `Transaction completed successfully for note ID: ${note.id}`,
      );
    } catch (error) {
      this.logger.error(`Failed to save note: ${error}`);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  private async handleEvent(event: any, session: ClientSession): Promise<void> {
    if (event instanceof NoteCreated) {
      await this.createNote(event, session);
    } else if (event instanceof NoteUpdated) {
      await this.updateNoteContent(event, session);
    } else if (event instanceof NoteTagsUpdated) {
      await this.updateNoteTags(event, session);
    } else if (event instanceof NoteArchived) {
      await this.archiveNote(event, session);
    } else if (event instanceof NoteMovedToNotebook) {
      await this.moveNoteToNotebook(event, session);
    } else {
      this.logger.warn(`Unhandled event: ${event.constructor.name}`);
    }
  }

  private async createNote(
    event: NoteCreated,
    session: ClientSession,
  ): Promise<void> {
    const notePersistenceModel = this.noteMapper.toPersistenceModel(
      event.data['note'],
    );

    await this.noteModel.create([notePersistenceModel], { session });
  }

  private async updateNoteContent(
    event: NoteUpdated,
    session: ClientSession,
  ): Promise<void> {
    await this.noteModel.updateOne(
      { id: event.data['noteId'] },
      {
        title: event.data['title'],
        content: event.data['content'],
        updatedAt: new Date(),
      },
      { session },
    );
  }

  private async updateNoteTags(
    event: NoteTagsUpdated,
    session: ClientSession,
  ): Promise<void> {
    await this.noteModel.updateOne(
      { id: event.data['noteId'] },
      { tags: event.data['tags'], updatedAt: new Date() },
      { session },
    );
  }

  private async archiveNote(
    event: NoteArchived,
    session: ClientSession,
  ): Promise<void> {
    await this.noteModel.updateOne(
      { id: event.data['noteId'] },
      {
        isArchived: true,
        archivedAt: event.data['archivedAt'],
        updatedAt: new Date(),
      },
      { session },
    );
  }

  private async moveNoteToNotebook(
    event: NoteMovedToNotebook,
    session: ClientSession,
  ): Promise<void> {
    await this.noteModel.updateOne(
      { id: event.data['noteId'] },
      { notebookId: event.data['notebookId'], updatedAt: new Date() },
      { session },
    );
  }

  async loadById(noteId: string): Promise<Note | null> {
    const note = await this.noteModel.findOne({ id: noteId });

    return note ? this.noteMapper.toDomain(note) : null;
  }
}
