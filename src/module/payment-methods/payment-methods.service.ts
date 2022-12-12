import { Injectable } from '@nestjs/common';
import { PaymentMethodType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { decryptData, encryptData } from 'src/util/crypto';
import {
  EncryptedStoredData,
  UserJwtRequestPayload,
} from 'src/util/global-types';
import { StripeService } from '../stripe/stripe.service';
import { CreateCardPaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private prisma: PrismaService,
    private readonly stripe: StripeService,
  ) {}

  async createCardMethod(
    createCardPaymentMethodDto: CreateCardPaymentMethodDto,
    user: UserJwtRequestPayload,
  ) {
    const { type, cvv, ...cardInfo } = createCardPaymentMethodDto;

    const [encryptedCardNumber, encryptedCardName] = await Promise.all([
      encryptData(cardInfo.cardNumber),
      encryptData(cardInfo.holderName),
    ]);

    const stripePaymentMethod = await this.stripe.createPaymentMethod({
      type: 'card',
      card: {
        number: cardInfo.cardNumber,
        exp_month: cardInfo.expiryMonth,
        exp_year: cardInfo.expiryYear,
        cvc: cvv,
      },
    });

    if (!user.stripeCustomerId) {
      const stripeCustomer = await this.stripe.createCustomer({
        name: user.firstName,
        email: user.account.email,
        metadata: {
          id: user.id,
          userType: user.userType,
        },
      });

      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeCustomer.id,
        },
      });
    }

    return this.prisma.paymentMethod.create({
      data: {
        type: type,
        stripePaymentMethodId: stripePaymentMethod.id,
        user: {
          connect: {
            id: user.id,
          },
        },
        cardInfo: {
          create: {
            cardNumber: encryptedCardNumber,
            holderName: encryptedCardName,
            expiryMonth: cardInfo.expiryMonth,
            expiryYear: cardInfo.expiryYear,
            brand: cardInfo.brand,
          },
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
        cardInfo: {
          select: {
            brand: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const paymentMethodData = await this.prisma.paymentMethod.findUnique({
      where: {
        id_userId: {
          id: id,
          userId: userId,
        },
      },
      include: {
        cardInfo: true,
      },
    });

    if (paymentMethodData.type === PaymentMethodType.CARD) {
      const { cardNumber: cardNumberJson, holderName: holderNameJson } =
        paymentMethodData.cardInfo;

      const cardNumberData = cardNumberJson as EncryptedStoredData;
      const holderNameData = holderNameJson as EncryptedStoredData;

      const [decryptedCardNumber, decryptedHolderName] = await Promise.all([
        decryptData(cardNumberData.data, Buffer.from(cardNumberData.iv.data)),
        decryptData(holderNameData.data, Buffer.from(holderNameData.iv.data)),
      ]);

      paymentMethodData.cardInfo.cardNumber = decryptedCardNumber.slice(-4);
      paymentMethodData.cardInfo.holderName = decryptedHolderName;
    }

    return paymentMethodData;
  }

  async remove(id: string, userId: string) {
    const deletedPaymentMethod = await this.prisma.paymentMethod.delete({
      where: {
        id_userId: {
          id: id,
          userId: userId,
        },
      },
    });

    this.stripe.detachPaymentMethod(deletedPaymentMethod.stripePaymentMethodId);
    return deletedPaymentMethod;
  }
}
