// import { Prisma } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

// const createJobInvitationArgs = Prisma.validator<Prisma.JobInvitationArgs>()({
//   select: {
//     jobId: true,
//     freelancerId: true,
//   },
// });

// type createJobInvitationType = Prisma.JobInvitationGetPayload<
//   typeof createJobInvitationArgs
// >;

class FreelancerIdsDto {
  freelancerId: string;
}

export class CreateJobInvitationDto {
  jobId: string;
  @ApiProperty({ type: () => FreelancerIdsDto, isArray: true })
  freelancerIds: FreelancerIdsDto[];
}
