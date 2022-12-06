import { Visibility } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { UpdateJobDto } from '../dto/update-job.dto';

const schemaObj = InferKeys<UpdateJobDto>({
  title: z.string().optional(),
  link: z.string().optional(),
  location: z.string().optional(),
  visibility: z.nativeEnum(Visibility).optional(),
  postedAt: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date())
    .optional(),
  requiredExperienceLevel: z.string().optional(),
  requiredSkills: z
    .array(
      z.object({
        skillId: z.string(),
      }),
    )
    .optional(),
});

export const UpdateJobSchema = z.object(schemaObj);
