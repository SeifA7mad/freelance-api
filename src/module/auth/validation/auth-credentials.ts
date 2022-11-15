import { z } from 'zod';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<AuthCredentialsDto>({
  email: z.string().email(),
  password: z.string(),
});

export const AuthCredentialsSchema = z.object(schemaObj);
