import { z } from 'zod';
import { CreateClientType } from '../dto/create-client.dto';
import { passwordRegex } from 'src/util/constants';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<CreateClientType>({
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
  timeZone: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  email: z.string(),
  password: z.string().regex(new RegExp(passwordRegex), {
    message:
      'Password must contains Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  }),
});

export const CreateClientSchema = z.object(schemaObj);
