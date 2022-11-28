import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

const createProposalArgs = Prisma.validator<Prisma.ProposalArgs>()({
  select: {
    bid: true,
    projectLength: true,
    coverLetter: true,
    jobId: true,
  },
});

export type CreateProposalType = Prisma.ProposalGetPayload<
  typeof createProposalArgs
>;

const createProposalAttachmentArgs =
  Prisma.validator<Prisma.ProposalAttachmentsArgs>()({
    select: {
      url: true,
    },
  });

export type CreateProposalAttachmentType = Prisma.ProposalAttachmentsGetPayload<
  typeof createProposalAttachmentArgs
>;

class CreateProposalAttachmentDto implements CreateProposalAttachmentType {
  url: string;
}

export class CreateProposalDto implements CreateProposalType {
  bid: number;
  projectLength: string;
  coverLetter: string;
  jobId: string;
  @ApiProperty({ type: () => CreateProposalAttachmentDto, isArray: true })
  attachments: CreateProposalAttachmentDto[];
}
