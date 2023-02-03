import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UserJwtRequestPayload,
  getUserContractFilterBasedOnType,
  getUserFilterBasedOnType,
} from 'src/util/global-types';
import { UserType } from '../auth/dto/user-jwt-payload.interface';
import { MessageData } from 'src/gateway/chat-rooms/dto/types';
import { FindAllQueryParamsDto } from './dto/findAll-messages.dto';

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

  async findAllMessages(
    contractId: string,
    user: UserJwtRequestPayload,
    query: FindAllQueryParamsDto,
  ) {
    let cursor = null;
    if (query.cursor) {
      cursor = {
        cursor: {
          id: query.cursor,
        },
        skip: 1,
      };
    }
    const messages = await this.prisma.contract.findUnique({
      where: {
        ...getUserContractFilterBasedOnType(contractId, user.id, user.userType),
      },
      select: {
        chatMessages: {
          ...cursor,
          take: query.limit,
          orderBy: {
            id: 'desc',
          },
          select: {
            id: true,
            text: true,
            attachment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                account: {
                  select: {
                    userName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      messages: messages.chatMessages,
      //@ts-ignore
      cursor: messages.chatMessages[query.limit - 1]?.id,
    };
  }
}
