import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountsController } from './accounts.controller';

@Module({
  providers: [AccountsService],
  imports: [PrismaModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
