import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FreelancersController],
  providers: [FreelancersService],
  imports: [PrismaModule],
})
export class FreelancersModule {}
