import { routesV1 } from '@common/infrastructure/configs/app.routes';
import {
  Controller,
  Post,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ArchiveNoteCommand } from '../../application/use-cases/commands/archive-note/archive-note.command';
import { CreateNoteCommand } from '../../application/use-cases/commands/create-note/create-note.command';
import { UpdateNoteCommand } from '../../application/use-cases/commands/update-note/update-note.command';
import { CreateNoteRequestDto } from './dto/create-node.request.dto';
import { UpdateNoteRequestDto } from './dto/update-note.request.dto';
import { TokenGuard } from '@common/infrastructure/guards/jwt.guard';
import { UserData } from '@common/infrastructure/decorators/decorator';
import { GetNoteByIdQuery } from '../../application/use-cases/queries/get-by-id/get-by-id.query';
import { NoteResponseDto } from './dto/note.response.dto';

@ApiBearerAuth()
@UseGuards(TokenGuard)
@ApiTags(routesV1.notes.root)
@Controller({ version: routesV1.version })
export class NoteHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(routesV1.notes.getById)
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiOkResponse({ type: NoteResponseDto })
  getById(@Param('noteId') noteId: string, @UserData('id') userId: string) {
    return this.queryBus.execute(new GetNoteByIdQuery({ noteId, userId }));
  }

  @Post(routesV1.notes.create)
  @ApiOperation({ summary: 'Create a new note' })
  async createNote(
    @Body() payload: CreateNoteRequestDto,
    @UserData('id') userId: string,
  ) {
    return this.commandBus.execute(
      new CreateNoteCommand({
        ...payload,
        userId,
      }),
    );
  }

  @Put(routesV1.notes.update)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing note' })
  async updateNote(
    @Param('noteId') noteId: string,
    @Body() payload: UpdateNoteRequestDto,
    @UserData('id') userId: string,
  ) {
    return this.commandBus.execute(
      new UpdateNoteCommand({
        ...payload,
        noteId,
        userId,
      }),
    );
  }

  @Post(routesV1.notes.archive)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a note' })
  async archiveNote(
    @Param('noteId') noteId: string,
    @UserData('id') userId: string,
  ) {
    return this.commandBus.execute(
      new ArchiveNoteCommand({
        noteId,
        userId,
      }),
    );
  }
}
