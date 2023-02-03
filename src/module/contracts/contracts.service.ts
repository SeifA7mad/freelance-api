import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UserJwtRequestPayload,
  getUserContractFilterBasedOnType,
  getUserFilterBasedOnType,
} from 'src/util/global-types';
import { CreateContractDto } from './dto/create-contract.dto';
import { AddFundsDto } from './dto/add-funds.dto';
import { FindAllQueryParamsDto } from './dto/findAll-contracts.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, createContractDto: CreateContractDto) {
    // Check if the provided project is linked to a job or not
    if (createContractDto.projectId) {
      const jobLinkedToProject = await this.prisma.job.findUnique({
        where: {
          projectId: createContractDto.projectId,
        },
      });

      if (jobLinkedToProject) {
        throw new ConflictException(
          'This Project is linked to a job please provide the job instead',
        );
      }
    }

    // get freelancer by his email
    const freelancer = await this.prisma.freelancer.findFirst({
      where: {
        user: {
          account: {
            email: createContractDto.freelancerEmail,
          },
        },
      },
    });

    // throw error if no freelancer found
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

  async findAll(user: UserJwtRequestPayload, query: FindAllQueryParamsDto) {
    const { limit, page } = query;

    const numberToSkip = limit * (page - 1) || undefined;

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.contract.count({
        where: getUserFilterBasedOnType(user.id, user.userType),
      }),
      this.prisma.contract.findMany({
        take: limit,
        skip: numberToSkip,
        where: getUserFilterBasedOnType(user.id, user.userType),
        include: {
          job: true,
          project: true,
        },
      }),
    ]);

    return { totalCount, data };
  }

  findOne(id: string, user: UserJwtRequestPayload) {
    return this.prisma.contract.findUnique({
      where: {
        ...getUserContractFilterBasedOnType(id, user.id, user.userType),
      },
      include: {
        job: true,
        project: true,
        feedbacks: true,
        milestones: true,
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

  async addFunds(id: string, clientId: string, addFundsDto: AddFundsDto) {
    const { amount } = addFundsDto;

    // get the wallet for the client
    const { wallet: clientWallet } = await this.prisma.user.findUnique({
      where: {
        id: clientId,
      },
      select: {
        wallet: {
          select: {
            available: true,
          },
        },
      },
    });

    // check if the client has a sufficient amount in his wallet or not
    if (amount > clientWallet.available) {
      throw new BadRequestException(
        'Client has insufficient amount in his wallet please deposit the required amount',
      );
    }

    // update the contract with the new funded amount
    // update the client wallet to reduce the available amount
    const [updatedContract, _] = await this.prisma.$transaction([
      this.prisma.contract.update({
        where: {
          id_clientId: {
            id: id,
            clientId: clientId,
          },
        },
        data: {
          fundedPayment: {
            increment: amount,
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id: clientId,
        },
        data: {
          wallet: {
            update: {
              available: {
                decrement: amount,
              },
            },
          },
        },
      }),
    ]);

    return updatedContract;
  }
}
