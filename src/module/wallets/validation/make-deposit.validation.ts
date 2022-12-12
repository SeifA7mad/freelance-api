import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { MakeDepositDto } from '../dto/make-deposit.dto';

const schemaObj = InferKeys<MakeDepositDto>({
  amount: z.number().min(50),
  paymentMethodId: z.string().uuid(),
});

export const MakeDepositSchema = z.object(schemaObj);
