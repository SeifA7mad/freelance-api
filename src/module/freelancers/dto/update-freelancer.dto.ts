import { PartialType } from '@nestjs/swagger';
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

class dto implements updateFreelancerType {
  jobTitle: string;
  jobCategory: JobCategory;
  experienceLevel: ExperienceLevel;
}

export class UpdateFreelancerDto extends PartialType(dto) {}
