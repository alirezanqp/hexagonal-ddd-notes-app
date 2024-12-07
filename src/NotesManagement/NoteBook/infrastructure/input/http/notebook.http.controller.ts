import { routesV1 } from '@common/infrastructure/configs/app.routes';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddNoteToNotebookCommand } from 'src/NotesManagement/NoteBook/application/use-cases/commands/add-note-to-notebook/add-note-to-notebook.command';
import { CreateNotebookCommand } from 'src/NotesManagement/NoteBook/application/use-cases/commands/create-notebook/create-notebook.command';
import { RenameNotebookCommand } from 'src/NotesManagement/NoteBook/application/use-cases/commands/rename-notebook/rename-notebook.command';
import { CreateNotebookRequestDto } from './dto/create-notebook.request.dto';
import { NotebookNoteRequestDto } from './dto/notebook-note.request.dto';
import { RenameNotebookRequestDto } from './dto/rename-notebook.request.dto';
import { TokenGuard } from '@common/infrastructure/guards/jwt.guard';
import { UserData } from '@common/infrastructure/decorators/decorator';

@ApiBearerAuth()
@UseGuards(TokenGuard)
@ApiTags(routesV1.notebooks.root)
@Controller({ version: routesV1.version })
export class NotebookHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.notebooks.create)
  @ApiOperation({ summary: 'Create a new notebook' })
  async createNotebook(
    @Body() payload: CreateNotebookRequestDto,
    @UserData('id') userId: string,
  ) {
    return this.commandBus.execute(
      new CreateNotebookCommand({
        name: payload.name,
        userId,
      }),
    );
  }

  @Put(routesV1.notebooks.rename)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rename an existing notebook' })
  async renameNotebook(
    @Param('notebookId') notebookId: string,
    @Body() payload: RenameNotebookRequestDto,
    @UserData('id') userId: string,
  ) {
    return this.commandBus.execute(
      new RenameNotebookCommand({
        notebookId,
        newName: payload.newName,
        userId,
      }),
    );
  }

  @Post(routesV1.notebooks.addNote)
  @ApiOperation({ summary: 'Add a note to a notebook' })
  async addNoteToNotebook(
    @Param('notebookId') notebookId: string,
    @Body() payload: NotebookNoteRequestDto,
    @Request() req,
  ) {
    return this.commandBus.execute(
      new AddNoteToNotebookCommand({
        notebookId,
        noteId: payload.noteId,
        userId: req.user.id,
      }),
    );
  }
}
