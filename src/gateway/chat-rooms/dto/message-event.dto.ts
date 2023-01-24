import { Prisma } from '@prisma/client';
import { Modify } from 'src/util/TypescriptUtils';

const createChatMessageArgs = Prisma.validator<Prisma.ChatMessageArgs>()({
  select: {
    text: true,
    attachment: true,
    contractId: true,
  },
});

export type CreateChatMessageType = Prisma.ChatMessageGetPayload<
  typeof createChatMessageArgs
>;

export type CreateChatMessage_TextType = Modify<
  CreateChatMessageType,
  {
    attachment: never;
  }
>;

export type CreateChatMessage_AttachmentType = Modify<
  CreateChatMessageType,
  {
    text: never;
  }
>;

export class MessageEventDto implements CreateChatMessageType {
  text: string;
  attachment: string;
  contractId: string;
}
