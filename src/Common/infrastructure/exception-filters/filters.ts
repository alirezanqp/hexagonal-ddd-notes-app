import { ExceptionBase } from '@common/domain/exception/exceptions.base';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestContextService } from '../request-context/app-request.context';
import { ValidationError } from 'class-validator';

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

  catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = this.processError(error);
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private processError(error: unknown): ErrorResponse {
    // Handle ExceptionBase errors (custom domain exceptions)
    if (error instanceof ExceptionBase) {
      return this.handleDomainException(error);
    }

    // Handle standard HttpExceptions
    if (error instanceof HttpException) {
      return this.handleHttpException(error);
    }

    // Handle class-validator ValidationErrors
    if (error instanceof ValidationError) {
      return this.handleValidationError(error);
    }

    // Handle unknown/unhandled errors
    return this.handleUnknownError(error);
  }

  private handleDomainException(error: ExceptionBase): ErrorResponse {
    // Log internal server errors for debugging
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      this.logger.error(error);
      console.error(error.cause);
    }

    return {
      success: false,
      statusCode: error.httpStatus ?? 500,
      key: error.code,
      message: error.message,
      correlationId: error.correlationId,
    };
  }

  private handleHttpException(error: HttpException): ErrorResponse {
    return {
      success: false,
      statusCode: error.getStatus(),
      key: this.generateHttpExceptionKey(error),
      message: error.message,
      correlationId: RequestContextService.getRequestId(),
    };
  }

  private handleValidationError(error: ValidationError): ErrorResponse {
    return {
      success: false,
      statusCode: 400,
      key: 'BAD_REQUEST',
      message: 'Validation error',
      subErrors: Object.values(error.constraints ?? {}),
      correlationId: RequestContextService.getRequestId(),
    };
  }

  private handleUnknownError(error: unknown): ErrorResponse {
    // Log unexpected errors
    this.logger.error(error);
    console.error(error);

    return {
      success: false,
      statusCode: 500,
      key: 'INTERNAL_SERVER_ERROR',
      message: 'Something unexpected happened, please try again later',
      correlationId: RequestContextService.getRequestId(),
    };
  }

  private generateHttpExceptionKey(error: HttpException): string {
    if (error instanceof BadRequestException) return 'BAD_REQUEST';
    if (error instanceof NotFoundException) return 'NOT_FOUND';
    if (error instanceof UnauthorizedException) return 'FORBIDDEN';
    return 'UNKNOWN_HTTP_EXCEPTION';
  }
}
