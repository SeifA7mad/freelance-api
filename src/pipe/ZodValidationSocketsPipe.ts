import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (e: any) {
      throw new WsException({
        status: 'error',
        message: e.errors,
      });
    }
    return value;
  }
}
