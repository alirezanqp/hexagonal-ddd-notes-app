import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';

import {
  NotebookCollectionName,
  NotebookPersistenceModel,
} from './model/notebook.persistence.model';
import { NotebookMapper } from './mapper/notebook.mapper';
import { NotebookRepository } from 'src/NotesManagement/NoteBook/application/ports/notebook.repository';
import {
  NotebookCreated,
  NotebookRenamed,
  NoteAdded,
  NoteRemoved,
} from 'src/NotesManagement/NoteBook/domain/events/notebook.events';
import { Notebook } from 'src/NotesManagement/NoteBook/domain/notebook';

@Injectable()
export class MongodbNotebookRepository implements NotebookRepository {
  private readonly logger = new Logger(MongodbNotebookRepository.name);

  constructor(
    @InjectModel(NotebookCollectionName)
    private notebookModel: Model<NotebookPersistenceModel>,

    private readonly notebookMapper: NotebookMapper,
  ) {}

  async save(notebook: Notebook): Promise<void> {
    const session = await this.notebookModel.startSession();

    try {
      this.logger.log(`Saving notebook with ID: ${notebook.id}`);

      await session.withTransaction(async () => {
        const events = notebook.getEvents();
        const notebookPersistenceModel =
          this.notebookMapper.toPersistenceModel(notebook);

        for (const event of events) {
          this.logger.debug(`Processing event: ${event.constructor.name}`);

          if (event instanceof NotebookCreated) {
            this.logger.log(
              `Creating new notebook: ${notebookPersistenceModel.name}`,
            );
            await this.createNotebook(notebookPersistenceModel, session);
          }

          if (
            event instanceof NotebookRenamed ||
            event instanceof NoteAdded ||
            event instanceof NoteRemoved
          ) {
            this.logger.log(
              `Updating notebook: ${notebookPersistenceModel.name}`,
            );
            await this.updateNotebook(notebookPersistenceModel, session);
          }
        }
      });

      this.logger.log(
        `Notebook save transaction completed successfully for ID: ${notebook.id}`,
      );
    } catch (error) {
      this.logger.error(`Failed to save notebook: ${error}`);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async loadById(notebookId: string): Promise<Notebook | null> {
    const notebook = await this.notebookModel.findOne({
      id: notebookId,
    });

    if (notebook) {
      return this.notebookMapper.toDomain(notebook);
    }

    return null;
  }

  async loadAllByUserId(userId: string): Promise<Notebook[]> {
    const notebooks = await this.notebookModel.find({ userId });

    return notebooks.map((notebook) => this.notebookMapper.toDomain(notebook));
  }

  private async createNotebook(
    notebookPersistenceModel: NotebookPersistenceModel,
    session: ClientSession,
  ): Promise<void> {
    try {
      await this.notebookModel.create([notebookPersistenceModel], { session });
      this.logger.log(`Notebook created: ${notebookPersistenceModel.name}`);
    } catch (error) {
      this.logger.error(`Failed to create notebook: ${error}`);
      throw error;
    }
  }

  private async updateNotebook(
    notebookPersistenceModel: NotebookPersistenceModel,
    session: ClientSession,
  ): Promise<void> {
    try {
      const result = await this.notebookModel.updateOne(
        { id: notebookPersistenceModel.id },
        notebookPersistenceModel,
        { session },
      );

      if (result.modifiedCount > 0) {
        this.logger.log(
          `Notebook updated successfully: ${notebookPersistenceModel.name}`,
        );
      } else {
        this.logger.warn(
          `No documents were modified for notebook: ${notebookPersistenceModel.name}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to update notebook: ${error}`);
      throw error;
    }
  }
}
