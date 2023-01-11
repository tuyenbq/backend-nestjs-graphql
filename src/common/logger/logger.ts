import { Injectable, LoggerService } from '@nestjs/common';
import * as Winston from 'winston';
@Injectable()
export class Logger implements LoggerService {
  private options: Winston.LoggerOptions = {
    transports: [
      new Winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        format: Winston.format.combine(
          Winston.format.colorize({
            all: true,
          }),
        ),
      }),
      new Winston.transports.File({ filename: 'debug.log', level: 'debug' }),
    ],
  };

  logger: Winston.Logger;
  constructor() {
    this.logger = Winston.createLogger(this.options);
  }
  log(message: string) {
    this.logger.log({
      level: 'info',
      message,
    });
  }
  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
}
