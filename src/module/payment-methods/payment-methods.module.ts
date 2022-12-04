import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { StripeModule } from '../stripe/stripe.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  imports: [StripeModule, PrismaModule],
})
export class PaymentMethodsModule {}
