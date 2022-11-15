import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [PrismaModule],
})
export class ClientsModule {}
