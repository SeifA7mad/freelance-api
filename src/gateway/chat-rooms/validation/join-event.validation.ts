import { InferKeys } from 'src/util/TypescriptUtils';
import { JoinEventDto } from '../dto/join-event.dto';
import { z } from 'zod';

const schemaObj = InferKeys<JoinEventDto>({
  contractId: z.string().uuid(),
});

export const JoinEventSchema = z.object(schemaObj);
