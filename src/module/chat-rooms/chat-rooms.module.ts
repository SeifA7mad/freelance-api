import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomsService } from './chat-rooms.service';

@Module({
  providers: [ChatRoomsService],
  exports: [ChatRoomsService],
  imports: [PrismaModule],
})
export class ChatRoomsModule {}
