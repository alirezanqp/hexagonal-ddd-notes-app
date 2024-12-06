import { Module, Provider } from '@nestjs/common';
import { CreateNoteUseCase } from './Note/application/use-cases/commands/create-note/create-note.usecase';
import { UpdateNoteUseCase } from './Note/application/use-cases/commands/update-note/update-note.usecase';
import { ArchiveNoteUseCase } from './Note/application/use-cases/commands/archive-note/archive-note.usecase';
import { CreateNotebookUseCase } from './NoteBook/application/use-cases/commands/create-notebook/create-notebook.usecase';
import { RenameNotebookUseCase } from './NoteBook/application/use-cases/commands/rename-notebook/rename-notebook.usecase';
import { GetNoteByIdUseCase } from './Note/application/use-cases/queries/get-by-id/get-by-id.usecase';
import { Cache } from './Note/application/ports/cache.port';
import { RedisCache } from './Note/infrastructure/cache/redis.cache';
import { CqrsModule } from '@nestjs/cqrs';
import { AddNoteToNotebookUseCase } from './NoteBook/application/use-cases/commands/add-note-to-notebook/add-note-to-notebook.usecase';
import { NoteRepository } from './Note/application/ports/note.repository';
import { MongodbNoteRepository } from './Note/infrastructure/persistence/mongodb.note.repository';
import { NotebookRepository } from './NoteBook/application/ports/notebook.repository';
import { MongodbNotebookRepository } from './NoteBook/infrastructure/persistence/mongodb.notebook.repository';
import { NoteMapper } from './Note/infrastructure/persistence/mapper/note.mapper';
import { NotebookMapper } from './NoteBook/infrastructure/persistence/mapper/notebook.mapper';
import {
  NoteCollectionName,
  NotePersistenceSchema,
} from './Note/infrastructure/persistence/model/note.persistence.model';
import {
  NotebookCollectionName,
  NotebookPersistenceSchema,
} from './NoteBook/infrastructure/persistence/model/notebook.persistence.model';
import { MongooseModule } from '@nestjs/mongoose';

const commands = [
  // note
  CreateNoteUseCase,
  UpdateNoteUseCase,
  ArchiveNoteUseCase,

  // notebooks
  CreateNotebookUseCase,
  RenameNotebookUseCase,
  AddNoteToNotebookUseCase,
];

const queries = [GetNoteByIdUseCase];

const infrastructure: Provider[] = [
  { provide: Cache, useClass: RedisCache },
  { provide: NoteRepository, useClass: MongodbNoteRepository },
  { provide: NotebookRepository, useClass: MongodbNotebookRepository },
];

const mappers = [NoteMapper, NotebookMapper];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: NoteCollectionName, schema: NotePersistenceSchema },
      { name: NotebookCollectionName, schema: NotebookPersistenceSchema },
    ]),
  ],
  providers: [...commands, ...queries, ...infrastructure, ...mappers],
})
export class NotesManagementModule {}
