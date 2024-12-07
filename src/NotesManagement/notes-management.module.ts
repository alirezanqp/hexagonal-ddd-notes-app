import { Module, Provider } from '@nestjs/common';
import { CreateNoteUseCase } from './Note/application/use-cases/commands/create-note/create-note.usecase';
import { UpdateNoteUseCase } from './Note/application/use-cases/commands/update-note/update-note.usecase';
import { ArchiveNoteUseCase } from './Note/application/use-cases/commands/archive-note/archive-note.usecase';
import { CreateNotebookUseCase } from './NoteBook/application/use-cases/commands/create-notebook/create-notebook.usecase';
import { RenameNotebookUseCase } from './NoteBook/application/use-cases/commands/rename-notebook/rename-notebook.usecase';
import { GetNoteByIdUseCase } from './Note/application/use-cases/queries/get-by-id/get-by-id.usecase';
import { Cache } from './Note/application/ports/cache.port';
import { RedisCache } from './Note/infrastructure/output/cache/redis.cache';
import { CqrsModule } from '@nestjs/cqrs';
import { AddNoteToNotebookUseCase } from './NoteBook/application/use-cases/commands/add-note-to-notebook/add-note-to-notebook.usecase';
import { NoteRepository } from './Note/application/ports/note.repository';
import { MongodbNoteRepository } from './Note/infrastructure/output/persistence/mongodb.note.repository';
import { NotebookRepository } from './NoteBook/application/ports/notebook.repository';
import { NoteMapper } from './Note/infrastructure/output/persistence/mapper/note.mapper';
import {
  NoteCollectionName,
  NotePersistenceSchema,
} from './Note/infrastructure/output/persistence/model/note.persistence.model';

import { MongooseModule } from '@nestjs/mongoose';
import { NotebookMapper } from './NoteBook/infrastructure/output/persistence/mapper/notebook.mapper';
import {
  NotebookCollectionName,
  NotebookPersistenceSchema,
} from './NoteBook/infrastructure/output/persistence/model/notebook.persistence.model';
import { MongodbNotebookRepository } from './NoteBook/infrastructure/output/persistence/mongodb.notebook.repository';
import { NoteHttpController } from './Note/infrastructure/input/note.http.controller';
import { NotebookHttpController } from './NoteBook/infrastructure/input/http/notebook.http.controller';

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
  controllers: [NoteHttpController, NotebookHttpController],
  providers: [...commands, ...queries, ...infrastructure, ...mappers],
})
export class NotesManagementModule {}
