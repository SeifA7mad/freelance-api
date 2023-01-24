import { UserJwtPayload } from 'src/module/auth/dto/user-jwt-payload.interface';
import { JoinEventDto } from './join-event.dto';
import { MessageEventDto } from './message-event.dto';

export enum JOIN_STATUS {
  JOINED = 'JOINED',
  DISCONNECTED = 'DISCONNECTED',
}
export type JoinMessage = {
  userId: string;
  userName: string;
  join_status: JOIN_STATUS;
};

export interface ServerToClientEvents {
  join: (joinMessage: JoinMessage) => void;
  message: (messageDto: MessageEventDto) => void;
}

export interface ClientToServerEvents {
  join: () => void;
  message: () => void;
}

export interface SocketData {
  contracts: Set<string>;
  user: UserJwtPayload;
}

export interface InterServerEvents {}
