import { UserJwtPayload } from 'src/module/auth/dto/user-jwt-payload.interface';
import { JoinEventDto } from './join-event.dto';
import { MessageEventDto } from './message-event.dto';
import { Socket } from 'socket.io';

export enum JOIN_STATUS {
  JOINED = 'JOINED',
  DISCONNECTED = 'DISCONNECTED',
}

export type JoinMessage = {
  userId: string;
  userName: string;
  join_status: JOIN_STATUS;
};

export type MessageData = MessageEventDto & UserJwtPayload;

export interface ServerToClientEvents {
  join: (joinMessage: JoinMessage) => void;
  message: (messageDto: MessageData) => void;
}

export interface ClientToServerEvents {
  join: (joinEventDto: JoinEventDto) => void;
  message: (messageDto: MessageEventDto) => void;
}

export interface SocketData {
  rooms: Set<string>;
  user: UserJwtPayload;
}

export interface InterServerEvents {}

export type SocketNamespace = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
