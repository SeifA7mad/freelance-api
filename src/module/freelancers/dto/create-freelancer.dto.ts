import {
  ExperienceLevel,
  JobCategory,
  Freelancer as FreelancerModel,
} from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

import { CreateAccountType } from 'src/module/accounts/dto/CreateAccountDto.dto';
import { CreateUserType } from 'src/module/users/dto/create-user.dto';

export type CreateFreelancerType = Omit<FreelancerModel, 'id'> &
  CreateUserType &
  CreateAccountType;

export class CreateFreelancerDto implements CreateFreelancerType {
  readonly jobTitle: string;
  @ApiProperty({ enum: Object.values(JobCategory) })
  readonly jobCategory: JobCategory;
  @ApiProperty({ enum: Object.values(ExperienceLevel) })
  readonly experienceLevel: ExperienceLevel;
  readonly firstName: string;
  readonly lastName: string;
  @ApiProperty({ required: false })
  readonly bio: string;
  @ApiProperty({ required: false })
  readonly profilePicture: string;
  readonly timeZone: Date;
  readonly userName: string;
  readonly email: string;
  readonly password: string;
}
