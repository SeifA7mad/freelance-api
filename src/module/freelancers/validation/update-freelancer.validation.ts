import { z } from 'zod';
import { updateFreelancerType } from '../dto/update-freelancer.dto';
import { JobCategory, ExperienceLevel } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<updateFreelancerType>({
  jobTitle: z.string().optional(),
  jobCategory: z.nativeEnum(JobCategory).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
});

export const UpdateFreelancerSchema = z.object(schemaObj);
