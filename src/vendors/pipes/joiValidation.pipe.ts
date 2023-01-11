import { PipeTransform, Injectable } from '@nestjs/common';
import { JoiException } from '../exceptions/joi.exception';
import * as joi from 'joi';

type ObjectToSchemaJoi<T> = {
  [P in keyof T]: any;
};

@Injectable()
export class JoiValidationPipe<T = any> implements PipeTransform {
  schema: joi.Schema;
  constructor(
    schema: Partial<ObjectToSchemaJoi<T>>,
    private options: joi.ValidationOptions = {
      allowUnknown: true,
    },
  ) {
    this.schema = joi.object(schema);
  }

  transform(value: any) {
    const { error } = this.schema.validate(value, this.options);
    if (error) {
      throw new JoiException(error);
    }
    return value;
  }
}
