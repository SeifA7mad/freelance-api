import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MilestonesController],
  providers: [MilestonesService],
  imports: [PrismaModule],
})
export class MilestonesModule {}
