import { ApiProperty } from '@nestjs/swagger';
import { ExperienceLevel, JobSkill, Prisma, Visibility } from '@prisma/client';

const createJobArgs = Prisma.validator<Prisma.JobArgs>()({
  select: {
    title: true,
    visibility: true,
    location: true,
    link: true,
    requiredExperienceLevel: true,
    postedAt: true,
    projectId: true,
  },
});

export type createJobType = Prisma.JobGetPayload<typeof createJobArgs>;

export class JobSkillDto {
  skillId: string;
}

export class CreateJobDto implements createJobType {
  link: string;
  title: string;
  @ApiProperty({ enum: Object.values(Visibility), required: false })
  visibility: Visibility;
  location: string;
  @ApiProperty({ enum: Object.values(ExperienceLevel) })
  requiredExperienceLevel: ExperienceLevel;
  postedAt: Date;
  @ApiProperty({ type: () => JobSkillDto, isArray: true })
  requiredSkills: JobSkillDto[];
  projectId: string;
}
