import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserJwtRequestPayload } from 'src/util/global-types';
import { UserType } from '../auth/dto/user-jwt-payload.interface';
import { CreateContractDto } from './dto/create-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  private getUserFilterBasedOnType(userId: string, userType: UserType) {
    return userType === UserType.CLIENT
      ? { clientId: userId }
      : { freelancerId: userId };
  }

  async create(clientId: string, createContractDto: CreateContractDto) {
    if (createContractDto.projectId) {
      const jobLinkedToProject = await this.prisma.job.findUnique({
        where: {
          projectId: createContractDto.projectId,
        },
      });

      if (jobLinkedToProject) {
        throw new ConflictException(
          'This Project is linked to job please provide the job instead',
        );
      }
    }

    const freelancer = await this.prisma.freelancer.findFirst({
      where: {
        user: {
          account: {
            email: createContractDto.freelancerEmail,
          },
        },
      },
    });

    if (!freelancer) {
      throw new NotFoundException(
        'No freelancer found with provided email address',
      );
    }

    return this.prisma.contract.create({
      data: {
        startDate: createContractDto.startDate,
        endDate: createContractDto.endDate,
        client: {
          connect: {
            id: clientId,
          },
        },
        freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
        job: createContractDto.jobId && {
          connect: {
            id_clientId: {
              id: createContractDto.jobId,
              clientId: clientId,
            },
          },
        },
        project: createContractDto.projectId && {
          connect: {
            id_clientId: {
              id: createContractDto.projectId,
              clientId: clientId,
            },
          },
        },
      },
    });
  }

  findAll(user: UserJwtRequestPayload) {
    return this.prisma.contract.findMany({
      where: this.getUserFilterBasedOnType(user.id, user.userType),
      include: {
        job: true,
        project: true,
      },
    });
  }

  findOne(id: string, user: UserJwtRequestPayload) {
    return this.prisma.contract.findMany({
      where: {
        id: id,
        ...this.getUserFilterBasedOnType(user.id, user.userType),
      },
      include: {
        job: true,
        project: true,
        feedbacks: true,
        millestones: true,
        attachments: true,
        activities: true,
      },
    });
  }

  acceptContract(id: string, freelancerId: string) {
    return this.prisma.contract.update({
      where: {
        id_freelancerId_status: {
          id: id,
          freelancerId: freelancerId,
          status: 'INACTIVE',
        },
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  endContract(id: string, clientId: string) {
    return this.prisma.contract.update({
      where: {
        id_clientId_status: {
          id: id,
          clientId: clientId,
          status: 'ACTIVE',
        },
      },
      data: {
        status: 'COMPLETED',
      },
    });
  }
}
