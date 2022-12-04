import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { CreateCardPaymentMethodDto } from '../dto/create-payment-method.dto';

import { isCreditCard } from 'class-validator';
import { PaymentMethodType } from '@prisma/client';

const schemaObj = InferKeys<CreateCardPaymentMethodDto>({
  cardNumber: z.string().refine(isCreditCard, {
    message: 'Must be a valid credit card number',
  }),
  holderName: z.string(),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear(), {
    message: 'The credit card expired',
  }),
  brand: z.string(),
  cvv: z.string().min(3).max(3),
  type: z.nativeEnum(PaymentMethodType),
});

export const createCardPaymentMethodSchema = z.object(schemaObj);
