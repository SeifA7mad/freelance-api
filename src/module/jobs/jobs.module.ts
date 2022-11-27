import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [PrismaModule],
})
export class JobsModule {}
