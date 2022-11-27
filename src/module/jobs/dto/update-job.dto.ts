import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ExperienceLevel, Prisma, Visibility } from '@prisma/client';
import { CreateJobDto, JobSkillDto } from './create-job.dto';

const updateJobArgs = Prisma.validator<Prisma.JobArgs>()({
  select: {
    title: true,
    visibility: true,
    location: true,
    link: true,
    requiredExperienceLevel: true,
    postedAt: true,
  },
});

export type updateJobType = Prisma.JobGetPayload<typeof updateJobArgs>;

class UpdateJobPartial implements updateJobType {
  link: string;
  title: string;
  visibility: Visibility;
  location: string;
  requiredExperienceLevel: ExperienceLevel;
  postedAt: Date;
}

export class UpdateJobDto extends PartialType(UpdateJobPartial) {
  @ApiProperty({ type: () => JobSkillDto, isArray: true, required: false })
  requiredSkills: JobSkillDto[];
}
