import { InferKeys } from 'src/util/TypescriptUtils';
import {
  CreateProposalAttachmentType,
  CreateProposalDto,
} from '../dto/create-proposal.dto';
import { z } from 'zod';

const schemaObj = InferKeys<CreateProposalDto>({
  bid: z.number(),
  projectLength: z.string(),
  coverLetter: z.string(),
  jobId: z.string().uuid(),
  attachments: z.array(
    z.object(
      InferKeys<CreateProposalAttachmentType>({
        url: z.string(),
      }),
    ),
  ),
});

export const CreateProposalSchema = z.object(schemaObj);
