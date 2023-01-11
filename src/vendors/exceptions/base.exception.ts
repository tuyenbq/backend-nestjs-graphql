import { HttpStatus } from '@nestjs/common';

export class BaseException<T = any> extends Error {
  errorCode: string;
  details: T;
  httpStatus: HttpStatus;
  constructor(
    errorCode: string,
    message: string,
    details?: T,
    httpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super();
    this.details = details || null;
    this.message = message;
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
  }
}
