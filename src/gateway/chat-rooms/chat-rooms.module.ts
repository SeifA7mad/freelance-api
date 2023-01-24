import { Module } from '@nestjs/common';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { AuthModule } from 'src/module/auth/auth.module';
import { ContractsModule } from 'src/module/contracts/contracts.module';

@Module({
  providers: [ChatRoomsGateway],
  imports: [AuthModule, ContractsModule],
})
export class ChatRoomsModule {}
