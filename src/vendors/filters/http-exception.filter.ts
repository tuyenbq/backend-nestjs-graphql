import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Catch,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { BaseException } from '../exceptions/base.exception';
import { JoiException } from '../exceptions/joi.exception';

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    if (exception instanceof HttpException) {
      return this.httpExceptionHandler(exception);
    } else if (exception instanceof JoiException) {
      return this.joiExceptionHandler(exception);
    } else if (exception instanceof BaseException) {
      return this.httpBaseExceptionHandler(exception);
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        errorCode: HttpStatus.BAD_REQUEST,
        message: exception?.message,
        details: [],
      },
    };
  }
  httpExceptionHandler(exception: HttpException) {
    throw exception;
  }
  joiExceptionHandler(exception: JoiException) {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: {
        errorCode: exception.errorCode,
        message: exception.message,
        details: exception.details.map((x) => ({
          message: x.message,
          type: x.type,
          key: x.context.key,
          value: x.context.value,
        })),
      },
    };
  }
  httpBaseExceptionHandler(exception: BaseException) {
    return {
      statusCode: exception.httpStatus,
      data: null,
      error: {
        errorCode: exception.errorCode,
        message: exception.message,
        details: exception.details || [],
      },
    };
  }
}
