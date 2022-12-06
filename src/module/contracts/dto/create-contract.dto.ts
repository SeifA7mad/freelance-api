import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus, Prisma } from '@prisma/client';

const createContractArgs = Prisma.validator<Prisma.ContractArgs>()({
  select: {
    startDate: true,
    endDate: true,
    status: true,
    clientId: true,
    freelancerId: true,
  },
});

type CreateContractBaseType = Prisma.ContractGetPayload<
  typeof createContractArgs
>;

export type CreateContract_JobType = CreateContractBaseType & {
  jobId: string;
  projectId?: never;
};

export type CreateContract_ProjectType = CreateContractBaseType & {
  jobId?: never;
  projectId: string;
};

export type CreateContractType =
  | CreateContract_JobType
  | CreateContract_ProjectType;

export class CreateContractDto implements CreateContractBaseType {
  startDate: Date;
  @ApiProperty({ required: false })
  endDate: Date;
  @ApiProperty({ enum: Object.values(ContractStatus) })
  status: ContractStatus;
  freelancerId: string;
  clientId: string;
  jobId: string;
  projectId: string;
}
