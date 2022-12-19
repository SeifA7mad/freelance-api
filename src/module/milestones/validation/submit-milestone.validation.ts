import { InferKeys } from 'src/util/TypescriptUtils';
import { MilestoneSubmissionDto } from '../dto/submit-milestone.dto';
import { z } from 'zod';

const schemaObj = InferKeys<MilestoneSubmissionDto>({
  description: z.string().max(1000),
  attachment: z.string().url().optional(),
});

export const MilestoneSubmissionSchema = z.object(schemaObj);
