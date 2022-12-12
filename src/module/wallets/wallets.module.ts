import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  imports: [PrismaModule, StripeModule],
})
export class WalletsModule {}
