import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProposalsController],
  providers: [ProposalsService],
  imports: [PrismaModule],
})
export class ProposalsModule {}
