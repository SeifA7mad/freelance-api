import { ContractStatus, Prisma } from '@prisma/client';

const createContractArgs = Prisma.validator<Prisma.ContractArgs>()({
  select: {
    startDate: true,
    endDate: true,
    status: true,
    clientId: true,
  },
});

type CreateContractBaseType = Prisma.ContractGetPayload<
  typeof createContractArgs
>;

type CreateContract_JobType = CreateContractBaseType & {
  jobId: string;
  projectId?: never;
};

type CreateContract_ProjectType = CreateContractBaseType & {
  jobId?: never;
  projectId: string;
};

export type CreateContractType =
  | CreateContract_JobType
  | CreateContract_ProjectType;

export class CreateContractDto implements CreateContractBaseType {
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  clientId: string;
  jobId: string;
  projectId: string;
}
