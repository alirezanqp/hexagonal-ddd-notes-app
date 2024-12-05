import { ExceptionBase } from '@common/domain/exception/exceptions.base';
import { HttpStatus } from '@nestjs/common';

export class EmailAlreadyExists extends ExceptionBase {
  code: string = 'EMAIL_ALREADY_EXISTS';
  static message: string = 'Email already exists';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(EmailAlreadyExists.message, cause, metadata, httpStatus);
  }
}

export class EmailNotFound extends ExceptionBase {
  code: string = 'EMAIL_NOT_FOUND';
  static message: string = 'Email not found';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.NOT_FOUND,
  ) {
    super(EmailNotFound.message, cause, metadata, httpStatus);
  }
}

export class CredentialsNotValid extends ExceptionBase {
  code: string = 'CREDENTIALS_NOT_VALID';
  static message: string = 'Credentials not valid';

  constructor(
    cause?: Error,
    metadata?: unknown,
    httpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(EmailNotFound.message, cause, metadata, httpStatus);
  }
}
