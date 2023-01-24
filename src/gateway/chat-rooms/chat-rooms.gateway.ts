import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UsePipes } from '@nestjs/common';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/module/auth/auth.service';
import { ContractsService } from 'src/module/contracts/contracts.service';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  InterServerEvents,
  JoinMessage,
  JOIN_STATUS,
} from './dto/types';
import { JoinEventDto } from './dto/join-event.dto';
import { MessageEventDto } from './dto/message-event.dto';
import { ZodValidationPipe } from 'src/pipe/ZodValidationSocketsPipe';
import { JoinEventSchema } from './validation/join-event.validation';
import { UserJwtPayload } from 'src/module/auth/dto/user-jwt-payload.interface';

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
    private readonly contractService: ContractsService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    // TODO: get the jwtToken from handshake.auth
    const jwtToken = client.handshake.headers.authorization;
    // if (!jwtToken) {
    //   client._error('Invalid credentials');
    //   return;
    // }

    try {
      // Get the user Payload by the provided JWT token to check if valid
      const userPayload = await this.authService.getUserPayload(jwtToken);

      // Get all the contracts ids (room ids) for this user
      const contracts = await this.contractService.getAllContractIds(
        userPayload.userId,
        userPayload.userType,
      );

      // map the ids of contracts to a Set
      const contractsSet: Set<String> = new Set();
      contracts.forEach((contract) => contractsSet.add(contract.id));

      client.data.contracts = contractsSet;
      client.data.user = userPayload;
    } catch (err) {
      client.disconnect();
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(JoinEventSchema))
    joinEventDto: JoinEventDto,
  ) {
    const userContracts: Set<String> = client.data.contracts;

    if (!userContracts.has(joinEventDto.contractId)) {
      throw new WsException('Denied access');
    }

    const userData: UserJwtPayload = client.data.user;
    const joinMessage: JoinMessage = {
      userId: userData.userId,
      userName: userData.username,
      join_status: JOIN_STATUS.JOINED,
    };
    this.server.emit('join', joinMessage);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageEventDto: MessageEventDto,
  ) {
    this.server.emit('message', messageEventDto);
  }
}
