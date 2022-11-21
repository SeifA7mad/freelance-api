import { z } from 'zod';
import { createFreelancerWithUserAccountType } from '../dto/create-freelancer.dto';
import { JobCategory, ExperienceLevel } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';
import { CreateUserSchema } from 'src/module/users/validation/create-user';

const schemaObj = InferKeys<createFreelancerWithUserAccountType>({
  experienceLevel: z.nativeEnum(ExperienceLevel),
  jobTitle: z.string(),
  jobCategory: z.nativeEnum(JobCategory),
  user: CreateUserSchema,
});

export const CreateFreelancerSchema = z.object(schemaObj);
