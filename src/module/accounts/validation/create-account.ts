import { z } from 'zod';
import { createAccountType } from '../dto/create-account.dto';
import { InferKeys } from 'src/util/TypescriptUtils';
import { passwordRegex } from 'src/util/constants';

const schemaObj = InferKeys<createAccountType>({
  userName: z.string(),
  email: z.string().email(),
  password: z.string().regex(passwordRegex, {
    message:
      'must contains Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  }),
});

export const CreateAccountSchema = z.object(schemaObj);
