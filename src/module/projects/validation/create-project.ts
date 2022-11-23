import { z } from 'zod';
import { CreateProjectDto } from '../dto/create-project.dto';
import { JobCategory, PaymentType, ProjectType } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<CreateProjectDto>({
  title: z.string(),
  category: z.nativeEnum(JobCategory),
  description: z.string(),
  paymentType: z.nativeEnum(PaymentType),
  type: z.nativeEnum(ProjectType),
  price: z.number(),
  projectLength: z.string(),
});

export const CreateProjectSchema = z.object(schemaObj);
