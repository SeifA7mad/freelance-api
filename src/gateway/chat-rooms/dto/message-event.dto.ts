import { Prisma } from '@prisma/client';

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

export class MessageEventDto implements CreateChatMessageType {
  text: string;
  attachment: string;
  contractId: string;
}
