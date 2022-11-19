import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  ExperienceLevel,
  JobCategory,
  Freelancer as FreelancerModel,
} from '@prisma/client';

export type UpdateFreelancerType = Omit<FreelancerModel, 'id'>;

class dto implements UpdateFreelancerType {
  jobTitle: string;
  jobCategory: JobCategory;
  experienceLevel: ExperienceLevel;
}

export class UpdateFreelancerDto extends PartialType(dto) {}
