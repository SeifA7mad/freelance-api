import { InferKeys } from 'src/util/TypescriptUtils';
import { CreateChatMessageType } from '../dto/message-event.dto';
import { z } from 'zod';

const schemaObj = InferKeys<CreateChatMessageType>({
  text: z.string().max(5000, 'Max 5000 words'),
  attachment: z.string().url(),
  contractId: z.string().uuid(),
});

const schemaTextObj = z.object(schemaObj).extend({
  attachment: z.undefined(),
});

const schemaAttachmentObj = z.object(schemaObj).extend({
  text: z.undefined(),
});

export const MessageEventSchema = z
  .object(schemaObj)
  .or(schemaTextObj)
  .or(schemaAttachmentObj);
