import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (e: any) {
      throw new BadRequestException(e.errors);
    }
    return value;
  }
}
