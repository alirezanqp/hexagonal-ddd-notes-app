import { ExceptionBase } from '@common/domain/exception/exceptions.base';
import { HttpStatus } from '@nestjs/common';

export class NotebookNotFound extends ExceptionBase {
  code: string = 'NOTEBOOK_NOT_FOUND';
  static message = 'Notebook not found';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.NOT_FOUND,
  ) {
    super(NotebookNotFound.message, cause, metadata, httpStatus);
  }
}

export class UnauthorizedNotebookAccess extends ExceptionBase {
  code: string = 'UNAUTHORIZED_NOTEBOOK_ACCESS';
  static message = 'Unauthorized notebook access';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.FORBIDDEN,
  ) {
    super(UnauthorizedNotebookAccess.message, cause, metadata, httpStatus);
  }
}
