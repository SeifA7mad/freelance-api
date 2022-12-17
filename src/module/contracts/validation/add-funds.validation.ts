import { InferKeys } from 'src/util/TypescriptUtils';
import { AddFundsDto } from '../dto/add-funds.dto';
import { z } from 'zod';

const schemaObj = InferKeys<AddFundsDto>({
  amount: z.number().min(1000),
});

export const AddFundsSchema = z.object(schemaObj);
