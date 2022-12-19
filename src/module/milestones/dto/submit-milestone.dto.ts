import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

const milestoneSubmissionArgs =
  Prisma.validator<Prisma.MilestoneSubmissionArgs>()({
    select: {
      description: true,
      attachment: true,
    },
  });

type milestoneSubmissionType = Prisma.MilestoneSubmissionGetPayload<
  typeof milestoneSubmissionArgs
>;

export class MilestoneSubmissionDto implements milestoneSubmissionType {
  description: string;
  @ApiProperty({ required: false, description: 'URL' })
  attachment: string;
}
