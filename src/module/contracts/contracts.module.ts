import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService],
  imports: [PrismaModule],
})
export class ContractsModule {}
