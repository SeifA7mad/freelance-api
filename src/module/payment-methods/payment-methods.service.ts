import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { CreateCardPaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createCardMethod(
    createCardPaymentMethodDto: CreateCardPaymentMethodDto,
    userId: string,
  ) {
    const { type, cvv, ...cardInfo } = createCardPaymentMethodDto;

    const stripePaymentMethod = await this.stripeService.createPaymentMethod({
      type: 'card',
      card: {
        number: cardInfo.cardNumber,
        exp_month: cardInfo.expiryMonth,
        exp_year: cardInfo.expiryYear,
        cvc: cvv,
      },
    });

    return this.prisma.paymentMethod.create({
      data: {
        type: type,
        stripePaymentMethodId: stripePaymentMethod.id,
        user: {
          connect: {
            id: userId,
          },
        },
        cardInfo: {
          create: cardInfo,
        },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: {
        userId: userId,
      },
      include: {
        cardInfo: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  // update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
  //   return `This action updates a #${id} paymentMethod`;
  // }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
