import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ContractStatus, MilestoneStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMilestoneDto: CreateMilestoneDto) {
    const { contractId, ...milestoneDate } = createMilestoneDto;

    // Check if the provided Contract id is available & ACTIVE
    const contract = await this.prisma.contract.findFirst({
      where: {
        id: contractId,
        status: ContractStatus.ACTIVE,
      },
    });

    if (!contract) {
      throw new NotFoundException('No active contracts found');
    }

    // Check if Contract has only Fulfilled Milestones
    const notFulfilledMilestone = await this.prisma.milestone.findFirst({
      where: {
        contractId: contractId,
        status: {
          not: MilestoneStatus.FULFILLED,
        },
      },
    });

    if (notFulfilledMilestone) {
      throw new ForbiddenException(
        `There is a ${notFulfilledMilestone.status} ${notFulfilledMilestone.name} Milestone`,
      );
    }

    return this.prisma.milestone.create({
      data: {
        ...milestoneDate,
        contract: {
          connect: {
            id: contractId,
          },
        },
      },
    });
  }

  findAll(contractId: string) {
    return this.prisma.milestone.findMany({
      where: {
        contractId: contractId,
      },
    });
  }

  findOne(id: string, contractId: string) {
    return this.prisma.milestone.findFirst({
      where: {
        id: id,
        contractId: contractId,
      },
    });
  }

  update(id: number, updateMilestoneDto: UpdateMilestoneDto) {
    return `This action updates a #${id} milestone`;
  }

  remove(id: number) {
    return `This action removes a #${id} milestone`;
  }
}
