import { InferKeys } from 'src/util/TypescriptUtils';
import { CreateProposalAttachmentType } from '../dto/create-proposal.dto';
import { z } from 'zod';
import { UpdateProposalDto } from '../dto/update-proposal.dto';

const schemaObj = InferKeys<UpdateProposalDto>({
  bid: z.number().optional(),
  projectLength: z.string().optional(),
  coverLetter: z.string().optional(),
  attachments: z
    .array(
      z.object(
        InferKeys<CreateProposalAttachmentType>({
          url: z.string(),
        }),
      ),
    )
    .optional(),
});

export const UpdateProposalSchema = z.object(schemaObj);
