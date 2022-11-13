import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AccountsService],
  imports: [PrismaModule],
})
export class AccountsModule {}
