import { z } from 'zod';
import { createClientWithUserAccountType } from '../dto/create-client.dto';
import { InferKeys } from 'src/util/TypescriptUtils';
import { CreateUserSchema } from 'src/module/users/validation/create-user';

const schemaObj = InferKeys<createClientWithUserAccountType>({
  user: CreateUserSchema,
});

export const CreateClientSchema = z.object(schemaObj);
