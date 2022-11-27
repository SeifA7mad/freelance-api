import { Visibility } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { CreateJobDto } from '../dto/create-job.dto';

const schemaObj = InferKeys<CreateJobDto>({
  title: z.string(),
  link: z.string(),
  location: z.string(),
  projectId: z.string(),
  visibility: z.nativeEnum(Visibility),
  postedAt: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  requiredExperienceLevel: z.string(),
  requiredSkills: z.array(
    z.object({
      skillId: z.string(),
    }),
  ),
});

export const CreateJobSchema = z.object(schemaObj);
