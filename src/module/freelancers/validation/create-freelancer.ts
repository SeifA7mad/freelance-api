import { z } from 'zod';
import { CreateFreelancerType } from '../dto/create-freelancer.dto';
import { JobCategory, ExperienceLevel } from '@prisma/client';

import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<CreateFreelancerType>({
  userName: z.string(),
  jobTitle: z.string(),
  jobCategory: z.nativeEnum(JobCategory),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
  timeZone: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  email: z.string(),
  password: z.string(),
});

export const CreateFreelancerSchema = z.object(schemaObj);
