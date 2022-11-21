import { z } from 'zod';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { InferKeys } from 'src/util/TypescriptUtils';

const schemaObj = InferKeys<CreateSkillDto>({
  skills: z.array(
    z.object({
      name: z.string(),
    }),
  ),
});

export const CreateSkillSchema = z.object(schemaObj);
