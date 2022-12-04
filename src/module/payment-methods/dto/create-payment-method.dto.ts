import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodType, Prisma } from '@prisma/client';

const createPaymentMethodArgs = Prisma.validator<Prisma.PaymentMethodArgs>()({
  select: {
    type: true,
  },
});

type createPaymentMethodType = Prisma.PaymentMethodGetPayload<
  typeof createPaymentMethodArgs
>;

class CreatePaymentMethodDto implements createPaymentMethodType {
  type: PaymentMethodType;
}

const createCardArgs = Prisma.validator<Prisma.CardInfoArgs>()({
  select: {
    cardNumber: true,
    holderName: true,
    expiryMonth: true,
    expiryYear: true,
    brand: true,
  },
});

type createCardType = Prisma.CardInfoGetPayload<typeof createCardArgs>;

export class CreateCardPaymentMethodDto
  extends CreatePaymentMethodDto
  implements createCardType
{
  cardNumber: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
  cvv: string;
}
