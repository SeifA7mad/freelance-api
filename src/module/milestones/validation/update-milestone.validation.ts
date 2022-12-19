import { InferKeys } from 'src/util/TypescriptUtils';
import { UpdateMilestoneDto } from '../dto/update-milestone.dto';
import { z } from 'zod';

const schemaObj = InferKeys<UpdateMilestoneDto>({
  name: z.string().optional(),
  amount: z.number().min(1000).optional(),
  description: z.string().optional(),
  dueDate: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().min(new Date(), { message: 'Due date must be in future' }))
    .optional(),
});

export const UpdateMilestoneSchema = z.object(schemaObj);
