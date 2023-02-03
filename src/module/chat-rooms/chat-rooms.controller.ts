import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserExceptAdminAuthGuard } from 'src/guard/user-except-admin-auth.guard';
import { JwtUserRequest } from 'src/util/global-types';
import { FindAllQueryParamsDto } from './dto/findAll-messages.dto';
import { Param } from '@nestjs/common/decorators';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get(':id/messages')
  @ApiBearerAuth()
  @UseGuards(UserExceptAdminAuthGuard)
  findAll(
    @Req() req: JwtUserRequest,
    @Param('id') id: string,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: FindAllQueryParamsDto,
  ) {
    return this.chatRoomsService.findAllMessages(id, req.user, query);
  }
}
