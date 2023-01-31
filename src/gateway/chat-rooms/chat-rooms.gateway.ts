import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets/decorators';
import { Server } from 'socket.io';
import { AuthService } from 'src/module/auth/auth.service';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  InterServerEvents,
  JoinMessage,
  JOIN_STATUS,
  SocketNamespace,
} from './dto/types';
import { JoinEventDto } from './dto/join-event.dto';
import { MessageEventDto } from './dto/message-event.dto';
import { ZodValidationPipe } from 'src/pipe/ZodValidationSocketsPipe';
import { JoinEventSchema } from './validation/join-event.validation';
import { MessageEventSchema } from './validation/message-event.validation';
import { ChatRoomsService } from 'src/module/chat-rooms/chat-rooms.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat-rooms',
})
export class ChatRoomsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  constructor(
    private readonly authService: AuthService,
    private readonly chatRoomsService: ChatRoomsService,
  ) {}

  async handleConnection(client: SocketNamespace, ...args: any[]) {
    // TODO: get the jwtToken from handshake.auth
    const jwtToken = client.handshake.headers.authorization;
    // if (!jwtToken) {
    //   client._error('Invalid credentials');
    //   return;
    // }

    try {
      // Get the user Payload by the provided JWT token to check if valid
      const userPayload = await this.authService.getUserPayload(jwtToken);

      // Get all the chatRooms ids for this user
      const chatRooms = await this.chatRoomsService.getAllIds(
        userPayload.userId,
        userPayload.userType,
      );

      // map the ids of chatRooms to a Set
      const chatRoomsSet: Set<string> = new Set();
      chatRooms.forEach(({ id }) => {
        chatRoomsSet.add(id);
      });

      client.data.rooms = chatRoomsSet;
      client.data.user = userPayload;
    } catch (err) {
      client.disconnect();
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: SocketNamespace,
    @MessageBody(new ZodValidationPipe(JoinEventSchema))
    joinEventDto: JoinEventDto,
  ) {
    const userRooms = client.data.rooms;

    if (!userRooms.has(joinEventDto.contractId)) {
      throw new WsException('Denied access');
    }

    client.join(joinEventDto.contractId);

    const userData = client.data.user;

    this.server.emit('join', {
      userId: userData.userId,
      userName: userData.username,
      join_status: JOIN_STATUS.JOINED,
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: SocketNamespace,
    @MessageBody(new ZodValidationPipe(MessageEventSchema))
    messageEventDto: MessageEventDto,
  ) {
    const userData = client.data.user;
    const { contractId } = messageEventDto;
    const messageData = {
      ...messageEventDto,
      ...userData,
    };
    this.server.to(contractId).emit('message', messageData);
    await this.chatRoomsService.create(messageData);
  }
}
