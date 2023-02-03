import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';

@Module({
  providers: [ChatRoomsService],
  exports: [ChatRoomsService],
  imports: [PrismaModule],
  controllers: [ChatRoomsController],
})
export class ChatRoomsModule {}
