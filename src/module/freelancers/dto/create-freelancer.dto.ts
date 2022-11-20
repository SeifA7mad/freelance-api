import { ApiProperty } from '@nestjs/swagger';
import { ExperienceLevel, JobCategory, Prisma } from '@prisma/client';

import { CreateUserDto } from 'src/module/users/dto/create-user.dto';

const createFreelancerWithUserAccountArgs =
  Prisma.validator<Prisma.FreelancerArgs>()({
    select: {
      user: {
        select: {
          account: {
            select: {
              userName: true,
              email: true,
              password: true,
            },
          },
          firstName: true,
          lastName: true,
          bio: true,
          profilePicture: true,
          timeZone: true,
        },
      },
      jobTitle: true,
      jobCategory: true,
      experienceLevel: true,
    },
  });

export type createFreelancerWithUserAccountType = Prisma.FreelancerGetPayload<
  typeof createFreelancerWithUserAccountArgs
>;

export class CreateFreelancerDto
  implements createFreelancerWithUserAccountType
{
  jobTitle: string;
  @ApiProperty({ enum: Object.values(JobCategory) })
  jobCategory: JobCategory;
  @ApiProperty({ enum: Object.values(ExperienceLevel) })
  experienceLevel: ExperienceLevel;
  @ApiProperty({ type: () => CreateUserDto })
  user: CreateUserDto;
}
