import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { CreateNotebookCommand } from './create-notebook.command';
import { NotebookRepository } from '../../../ports/notebook.repository';
import { Notebook } from 'src/NotesManagement/NoteBook/domain/notebook';

@CommandHandler(CreateNotebookCommand)
export class CreateNotebookUseCase
  implements ICommandHandler<CreateNotebookCommand>
{
  private readonly logger = new Logger(CreateNotebookUseCase.name);

  constructor(
    @Inject(NotebookRepository)
    private readonly notebookRepository: NotebookRepository,
  ) {}

  async execute(command: CreateNotebookCommand): Promise<string> {
    const { name, userId, ...metadata } = command;

    this.logger.log(`
      New CreateNotebookCommand executed for user: ${userId}
      command: ${JSON.stringify(metadata)}
    `);

    const notebook = Notebook.create({
      name,
      userId,
    });

    await this.notebookRepository.save(notebook);

    this.logger.log(`
      CreateNotebookCommand successfully executed
      Notebook ID: ${notebook.id}
      Command ID: ${command.id}
    `);

    return notebook.id;
  }
}
