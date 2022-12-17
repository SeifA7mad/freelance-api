import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';
import { MakeDepositDto } from './dto/make-deposit.dto';

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
  ) {}

  getWallet(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        wallet: true,
      },
    });
  }

  async deposit(userId: string, depositDto: MakeDepositDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        paymentMethods: {
          where: {
            id: depositDto.paymentMethodId,
          },
        },
        account: true,
      },
    });

    if (user.paymentMethods.length <= 0) {
      throw new NotFoundException('No payment methods found');
    }

    const paymentIntent = await this.stripe.createPaymentIntent({
      amount: depositDto.amount,
      currency: 'usd',
      confirm: true,
      payment_method: user.paymentMethods[0].stripePaymentMethodId,
      customer: user.stripeCustomerId,
      receipt_email: user.account.email,
      setup_future_usage: 'on_session',
    });

    const succeededPaymentStatus: Stripe.PaymentIntent.Status = 'succeeded';

    if (paymentIntent.status !== succeededPaymentStatus) {
      throw new BadRequestException('Payment is not succeeded');
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wallet: {
          update: {
            available: {
              increment: paymentIntent.amount_received,
            },
          },
        },
      },
      include: {
        wallet: true,
      },
    });
  }
}
