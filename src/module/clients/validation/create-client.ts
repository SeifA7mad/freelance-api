import { z } from 'zod';
import { CreateClientType } from '../dto/create-client.dto';

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
  password: z.string(),
});

export const CreateClientSchema = z.object(schemaObj);
