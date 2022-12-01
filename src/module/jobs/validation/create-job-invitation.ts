import { InferKeys } from 'src/util/TypescriptUtils';
import { z } from 'zod';
import { CreateJobInvitationDto } from '../dto/create-job-invitation.dto';

const schemaObj = InferKeys<CreateJobInvitationDto>({
  jobId: z.string().uuid(),
  freelancerIds: z.array(
    z.object({
      freelancerId: z.string().uuid(),
    }),
  ),
});

export const CreateJobInvitationSchema = z.object(schemaObj);
