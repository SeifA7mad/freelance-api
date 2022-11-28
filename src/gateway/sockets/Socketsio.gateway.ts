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
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) {
      client.emit('exception', 'Invalid credentials');
      client._error('Invalid credentials');
      return;
    }

    const jwtToken = client.handshake.headers.authorization
      .replace('Bearer', '')
      .trim();
    const userPayload = await this.authService.getUserPayload(jwtToken);

    if (!userPayload) {
      client.emit('exception', 'Invalid credentials');
      client._error('Invalid credentials');
      return;
    }

    this.cacheService.set(userPayload.userId, client.id);

    console.log('CONNECTED', userPayload.userId, client.id);
  }

  async handleDisconnect(client: Socket) {
    const jwtToken = client.handshake.headers.authorization
      .replace('Bearer', '')
      .trim();
    const userPayload = await this.authService.getUserPayload(jwtToken);

    this.cacheService.del(userPayload.userId);
    console.log('DISCONNECTED', userPayload.userId, client.id);
  }

  //   @SubscribeMessage('events')
  //   findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //     return from([1, 2, 3]).pipe(
  //       map((item) => ({ event: 'events', data: item })),
  //     );
  //   }

  @SubscribeMessage('jobs')
  async handleJobs(@MessageBody() data: string) {
    this.server.emit('jobs', data);
  }
}
