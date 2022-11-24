import { UnauthorizedException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/module/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const userPayload = await this.authService.getUserPayload(
      client.handshake.headers.authorization,
    );

    if (!userPayload) {
      client._error('Invalid credentials');
    }

    console.log(userPayload);

    console.log('CONNECTED', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('DISCONNECTED', client.id);
  }

  //   @SubscribeMessage('events')
  //   findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //     return from([1, 2, 3]).pipe(
  //       map((item) => ({ event: 'events', data: item })),
  //     );
  //   }

  @SubscribeMessage('jobs')
  async handleJobs(@MessageBody() data: string) {
    return data;
  }
}
