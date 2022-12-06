import { ContractStatus } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import {
  CreateContract_JobType,
  CreateContract_ProjectType,
} from '../dto/create-contract.dto';

const schemaJobObj = InferKeys<CreateContract_JobType>({
  startDate: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  endDate: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date())
    .optional(),
  status: z.nativeEnum(ContractStatus),
  clientId: z.string().uuid(),
  freelancerId: z.string().uuid(),
  jobId: z.string().uuid(),
  projectId: z.undefined(),
});

const schemaProjectObj = InferKeys<CreateContract_ProjectType>({
  startDate: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  endDate: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date())
    .optional(),
  status: z.nativeEnum(ContractStatus),
  clientId: z.string().uuid(),
  freelancerId: z.string().uuid(),
  projectId: z.string().uuid(),
  jobId: z.undefined(),
});

export const CreateContractSchema = z
  .object(schemaJobObj)
  .or(z.object(schemaProjectObj));
