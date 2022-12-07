import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserJwtRequestPayload } from 'src/util/global-types';
import { UserType } from '../auth/dto/user-jwt-payload.interface';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

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
        status: createContractDto.status,
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
    if (user.userType === UserType.ADMIN) {
      throw new UnauthorizedException('Admin have no contracts');
    }

    const whereCond =
      user.userType === UserType.CLIENT
        ? { clientId: user.id }
        : { freelancerId: user.id };

    return this.prisma.contract.findMany({
      where: whereCond,
      include: {
        job: true,
        project: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
