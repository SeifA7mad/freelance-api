import { z } from 'zod';
import { UpdateUserType } from '../dto/update-user.dto';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<UpdateUserType>({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
  timeZone: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date())
    .optional(),
});

export const UpdateUserSchema = z.object(schemaObj);
