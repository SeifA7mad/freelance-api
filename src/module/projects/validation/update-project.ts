import { z } from 'zod';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JobCategory, PaymentType, ProjectType } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<UpdateProjectDto>({
  title: z.string().optional(),
  category: z.nativeEnum(JobCategory).optional(),
  description: z.string().optional(),
  paymentType: z.nativeEnum(PaymentType).optional(),
  type: z.nativeEnum(ProjectType).optional(),
  price: z.number().optional(),
  projectLength: z.string().optional(),
});

export const UpdateProjectSchema = z.object(schemaObj);
