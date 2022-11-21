import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

const createSkillArgs = Prisma.validator<Prisma.SkillArgs>()({
  select: {
    name: true,
  },
});

type createSkillType = Prisma.SkillGetPayload<typeof createSkillArgs>;

class CreateSkillArgs implements createSkillType {
  name: string;
}

export class CreateSkillDto {
  @ApiProperty({ type: () => CreateSkillArgs, isArray: true })
  skills: CreateSkillArgs[];
}
