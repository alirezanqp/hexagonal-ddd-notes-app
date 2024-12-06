import { ExceptionBase } from '@common/domain/exception/exceptions.base';
import { HttpStatus } from '@nestjs/common';

export class NoteNotFound extends ExceptionBase {
  code: string = 'NOTE_NOT_FOUND';
  static message = 'Note not found';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.NOT_FOUND,
  ) {
    super(NoteNotFound.message, cause, metadata, httpStatus);
  }
}

export class UnauthorizedNoteAccess extends ExceptionBase {
  code: string = 'UNAUTHORIZED_NOTE_ACCESS';
  static message = 'Unauthorized note access';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.FORBIDDEN,
  ) {
    super(UnauthorizedNoteAccess.message, cause, metadata, httpStatus);
  }
}
