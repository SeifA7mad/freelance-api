import { ApiProperty } from '@nestjs/swagger';
import { ExperienceLevel, Prisma } from '@prisma/client';

const createFreelancerSkillsArgs =
  Prisma.validator<Prisma.FreelancerSkillArgs>()({
    select: {
      skillId: true,
      level: true,
    },
  });

type createFreelancerSkillsType = Prisma.FreelancerSkillGetPayload<
  typeof createFreelancerSkillsArgs
>;

class UpdateFreelancerSkillObj implements createFreelancerSkillsType {
  skillId: string;
  @ApiProperty({ enum: Object.values(ExperienceLevel) })
  level: ExperienceLevel;
}

export class UpdateFreelancerSkillsDto {
  @ApiProperty({ type: () => UpdateFreelancerSkillObj, isArray: true })
  freelancerSkills: UpdateFreelancerSkillObj[];
}
