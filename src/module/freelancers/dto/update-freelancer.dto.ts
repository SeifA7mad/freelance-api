import { ApiProperty } from '@nestjs/swagger';
import { ExperienceLevel, JobCategory, Prisma } from '@prisma/client';

const updateFreelancerArgs = Prisma.validator<Prisma.FreelancerArgs>()({
  select: {
    jobTitle: true,
    experienceLevel: true,
    jobCategory: true,
  },
});

export type updateFreelancerType = Prisma.FreelancerGetPayload<
  typeof updateFreelancerArgs
>;
export class UpdateFreelancerDto {
  @ApiProperty({ required: false })
  jobTitle: string;
  @ApiProperty({ enum: Object.values(JobCategory), required: false })
  jobCategory: JobCategory;
  @ApiProperty({ enum: Object.values(ExperienceLevel), required: false })
  experienceLevel: ExperienceLevel;
}
