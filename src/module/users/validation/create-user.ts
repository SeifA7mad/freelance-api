import { z } from 'zod';
import { createUserWithAccountType } from '../dto/create-user.dto';
import { InferKeys } from 'src/util/TypescriptUtils';
import { CreateAccountSchema } from 'src/module/accounts/validation/create-account';

const schemaObj = InferKeys<createUserWithAccountType>({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
  timeZone: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  account: CreateAccountSchema,
});

export const CreateUserSchema = z.object(schemaObj);
