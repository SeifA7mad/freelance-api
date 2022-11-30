import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  CreateProposalAttachmentDto,
  CreateProposalDto,
} from './create-proposal.dto';

class UpdateProposalPartialType implements Omit<CreateProposalDto, 'jobId'> {
  bid: number;
  projectLength: string;
  coverLetter: string;
  @ApiProperty({ type: () => CreateProposalAttachmentDto, isArray: true })
  attachments: CreateProposalAttachmentDto[];
}

export class UpdateProposalDto extends PartialType(UpdateProposalPartialType) {}
