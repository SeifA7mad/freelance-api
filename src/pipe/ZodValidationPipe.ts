import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (e) {
      throw new BadRequestException(e.errors);
    }

    // const result = this.schema.safeParse(value);
    // if (result.success === false) {
    //   const errs = [...result.error.formErrors.formErrors];

    //   Object.keys(result.error.formErrors.fieldErrors).forEach((key) => {
    //     errs.push(`(${key}) ${result.error.formErrors.fieldErrors[key]}`);
    //   });

    //   throw new BadRequestException(errs);
    // }
    return value;
  }
}
