import { ExceptionBase } from '@common/domain/exception/exceptions.base';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestContextService } from '../request-context/app-request.context';

export interface ErrorResponse {
  message: string;
  key: string;
  statusCode?: number;
  success: boolean;
  subErrors?: string[];
  correlationId?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionsFilter.name);

  catch(e: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (e instanceof BadRequestException) {
      e = new BadRequestException(e.message);
    }

    if (e instanceof NotFoundException) {
      e = new NotFoundException();
    }

    if (e instanceof ExceptionBase) {
      if (e.code === 'INTERNAL_SERVER_ERROR') {
        this.logger.log(e);
        console.log(e.cause);
      }

      const body: ErrorResponse = {
        success: false,
        statusCode: e.httpStatus,
        key: e.code,
        message: e.message,
        subErrors: e.message.length > 0 ? [e.message] : undefined,
        correlationId: e.correlationId,
      };
      response.status(e.httpStatus ?? 500).json(body);
    } else {
      this.logger.log(e);
      console.log(e);
      const body: ErrorResponse = {
        success: false,
        statusCode: 500,
        key: 'INTERNAL_SERVER_ERROR',
        message: 'Something unexpected happened, please try again later',
        correlationId: RequestContextService.getRequestId(),
      };
      response.status(500).json(body);
    }
  }
}
