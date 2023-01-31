import { Module } from '@nestjs/common';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { AuthModule } from 'src/module/auth/auth.module';
import { ChatRoomsModule } from 'src/module/chat-rooms/chat-rooms.module';

@Module({
  providers: [ChatRoomsGateway],
  imports: [AuthModule, ChatRoomsModule],
})
export class ChatRoomsSocketsModule {}
