import { ExperienceLevel } from '@prisma/client';
import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { UpdateFreelancerSkillsDto } from '../dto/update-skills.dto';

const schemaObj = InferKeys<UpdateFreelancerSkillsDto>({
  freelancerSkills: z.array(
    z.object({
      skillId: z.string(),
      level: z.nativeEnum(ExperienceLevel),
    }),
  ),
});

export const UpdateFreelancerSkillsSchema = z.object(schemaObj);
