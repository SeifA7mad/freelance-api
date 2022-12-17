import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { CreateMilestoneDto } from '../dto/create-milestone.dto';

const schemaObj = InferKeys<CreateMilestoneDto>({
  name: z.string(),
  amount: z.number().min(1000),
  dueDate: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().min(new Date(), { message: 'Due date must be in future' }))
    .optional(),
  description: z.string().optional(),
  contractId: z.string().uuid(),
});

export const CreateMilestoneSchema = z.object(schemaObj);
