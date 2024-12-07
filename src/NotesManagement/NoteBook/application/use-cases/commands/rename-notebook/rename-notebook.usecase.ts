import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { RenameNotebookCommand } from './rename-notebook.command';
import { NotebookRepository } from '../../../ports/notebook.repository';
import {
  NotebookNotFound,
  UnauthorizedNotebookAccess,
} from '../../../../domain/exceptions/notebook.exceptions';

@CommandHandler(RenameNotebookCommand)
export class RenameNotebookUseCase
  implements ICommandHandler<RenameNotebookCommand>
{
  private readonly logger = new Logger(RenameNotebookUseCase.name);

  constructor(
    @Inject(NotebookRepository)
    private readonly notebookRepository: NotebookRepository,
  ) {}

  async execute(command: RenameNotebookCommand): Promise<void> {
    const { notebookId, newName, userId, ...metadata } = command;

    this.logger.log(`
      New RenameNotebookCommand executed
      Notebook ID: ${notebookId}
      New Name: ${newName}
      command: ${JSON.stringify(metadata)}
    `);

    const notebook = await this.notebookRepository.loadById(notebookId);
    if (!notebook) {
      throw new NotebookNotFound();
    }

    if (notebook.userId !== userId) {
      throw new UnauthorizedNotebookAccess();
    }

    notebook.rename(newName);

    await this.notebookRepository.save(notebook);

    this.logger.log(`
      RenameNotebookCommand successfully executed
      Notebook ID: ${notebookId}
      Command ID: ${command.id}
    `);
  }
}
