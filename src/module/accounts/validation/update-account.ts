import { z } from 'zod';
import { InferKeys } from 'src/util/TypescriptUtils';
import { passwordRegex } from 'src/util/constants';
import { UpdateAccountDto } from '../dto/update-account.dto';

const schemaObj = InferKeys<UpdateAccountDto>({
  userName: z.string().optional(),
  email: z.string().email().optional(),
  password: z
    .string()
    .regex(new RegExp(passwordRegex), {
      message:
        'Password must contains Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    .optional(),
  oldPassword: z.string().regex(new RegExp(passwordRegex), {
    message:
      'Password must contains Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  }),
});

export const UpdateAccountSchema = z.object(schemaObj);
