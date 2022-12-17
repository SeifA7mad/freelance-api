import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

const createMilestoneArgs = Prisma.validator<Prisma.MilestoneArgs>()({
  select: {
    name: true,
    amount: true,
    dueDate: true,
    description: true,
    contractId: true,
  },
});

type CreateMilestoneType = Prisma.MilestoneGetPayload<
  typeof createMilestoneArgs
>;

export class CreateMilestoneDto implements CreateMilestoneType {
  name: string;
  amount: number;
  @ApiProperty({ required: false })
  dueDate: Date;
  @ApiProperty({
    required: false,
    description:
      'A positive integer representing how much to charge in the smallest currency unit (e.g., 100 cents to charge $1.00)',
  })
  description: string;
  contractId: string;
}
