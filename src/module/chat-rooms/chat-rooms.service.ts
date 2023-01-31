import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUserFilterBasedOnType } from 'src/util/global-types';
import { UserType } from '../auth/dto/user-jwt-payload.interface';
import { MessageData } from 'src/gateway/chat-rooms/dto/types';

@Injectable()
export class ChatRoomsService {
  constructor(private readonly prisma: PrismaService) {}

  getAllIds(userId: string, userType: UserType) {
    return this.prisma.contract.findMany({
      where: getUserFilterBasedOnType(userId, userType),
      select: {
        id: true,
      },
    });
  }

  create(messageData: MessageData) {
    return this.prisma.contract.update({
      where: {
        id: messageData.contractId,
      },
      data: {
        chatMessages: {
          create: [
            {
              text: messageData.text,
              attachment: messageData.attachment,
              user: {
                connect: {
                  id: messageData.userId,
                },
              },
            },
          ],
        },
      },
    });
  }
}
