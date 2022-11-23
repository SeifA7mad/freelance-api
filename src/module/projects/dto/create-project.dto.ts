import { ApiProperty } from '@nestjs/swagger';
import { JobCategory, Prisma, ProjectType, PaymentType } from '@prisma/client';

const createProjectArgs = Prisma.validator<Prisma.ProjectArgs>()({
  select: {
    title: true,
    category: true,
    description: true,
    paymentType: true,
    type: true,
    price: true,
    projectLength: true,
  },
});

type createProjectType = Prisma.ProjectGetPayload<typeof createProjectArgs>;

export class CreateProjectDto implements createProjectType {
  title: string;
  @ApiProperty({ enum: Object.values(JobCategory) })
  category: JobCategory;
  description: string;
  @ApiProperty({ enum: Object.values(PaymentType) })
  paymentType: PaymentType;
  @ApiProperty({ enum: Object.values(ProjectType) })
  type: ProjectType;
  price: number;
  projectLength: string;
}
