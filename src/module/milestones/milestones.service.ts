import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ContractStatus, MilestoneStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import {
  UserJwtRequestPayload,
  getUserFilterBasedOnType,
} from 'src/util/global-types';
import { MilestoneSubmissionDto } from './dto/submit-milestone.dto';

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

  findAll(contractId: string, user: UserJwtRequestPayload) {
    return this.prisma.milestone.findMany({
      where: {
        contract: {
          id: contractId,
          ...getUserFilterBasedOnType(user.id, user.userType),
        },
      },
    });
  }

  findOne(id: string, user: UserJwtRequestPayload) {
    return this.prisma.milestone.findFirst({
      where: {
        id: id,
        contract: {
          ...getUserFilterBasedOnType(user.id, user.userType),
        },
      },
      include: {
        submission: true,
      },
    });
  }

  async update(id: string, updateMilestoneDto: UpdateMilestoneDto) {
    // find if the milestone with the provided id is not PENDING => so it can't be updated
    const milestone = await this.prisma.milestone.findFirst({
      where: {
        id: id,
        status: {
          not: MilestoneStatus.PENDING,
        },
      },
    });

    if (milestone) {
      throw new ConflictException(
        `The milestone is ${milestone.status} can't be updated unless it's still PENDING`,
      );
    }

    return this.prisma.milestone.update({
      where: {
        id: id,
      },
      data: updateMilestoneDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} milestone`;
  }

  // Client activate a milestone
  async activate(id: string, clientId: string) {
    // retrieve milestone to check it's status and get the contractId
    const milestone = await this.prisma.milestone.findFirst({
      where: {
        id: id,
        contract: {
          clientId: clientId,
        },
      },
      include: {
        contract: {
          select: {
            freelancerId: true,
            fundedPayment: true,
          },
        },
      },
    });

    // checks if the milestone exist for the current client
    if (!milestone) {
      throw new NotFoundException(
        'No such a milestone found with the given id and the logged in client',
      );
    }

    // checks if it's not PENDING
    if (milestone.status !== MilestoneStatus.PENDING) {
      throw new ConflictException(
        `The milestone is ${milestone.status} can't be activated unless it's still PENDING`,
      );
    }

    // Checks if the contract have any milestone not FULFILLED
    const notFulfilledMilestone = await this.prisma.milestone.findFirst({
      where: {
        contractId: milestone.contractId,
        id: {
          not: milestone.id,
        },
        status: {
          not: MilestoneStatus.FULFILLED,
        },
      },
    });

    if (notFulfilledMilestone) {
      throw new ForbiddenException(
        `There is a ${notFulfilledMilestone.status} ${notFulfilledMilestone.name} Milestone must Fulfilled it first`,
      );
    }
    // check if the contract have sufficient funded amount to the milestone required amount
    if (milestone.contract.fundedPayment < milestone.amount) {
      throw new BadRequestException(
        'Contract has insufficient funded amount please add more funds',
      );
    }

    const [updatedMilestone] = await this.prisma.$transaction([
      // update milestone status = INPROGRESS
      this.prisma.milestone.update({
        where: {
          id: milestone.id,
        },
        data: {
          status: MilestoneStatus.INPROGRESS,
        },
      }),
      // update contract by decrementing the funded amount and increasing the inEscrow amount
      this.prisma.contract.update({
        where: {
          id: milestone.contractId,
        },
        data: {
          fundedPayment: {
            decrement: milestone.amount,
          },
          inEscrowPayment: {
            increment: milestone.amount,
          },
        },
      }),
      // update the freelancer wallet with the InEscrow amount
      this.prisma.user.update({
        where: {
          id: milestone.contract.freelancerId,
        },
        data: {
          wallet: {
            update: {
              workInProgress: {
                increment: milestone.amount,
              },
            },
          },
        },
      }),
    ]);

    return updatedMilestone;
  }

  // Freelancer submit work to the milestones
  async submit(
    id: string,
    freelancerId: string,
    milestoneSubmissionDto: MilestoneSubmissionDto,
  ) {
    // retrieve milestone to check it's status and get the contractId
    const milestone = await this.prisma.milestone.findFirst({
      where: {
        id: id,
        contract: {
          freelancerId: freelancerId,
        },
      },
    });

    // checks if the milestone exist for the current freelancer
    if (!milestone) {
      throw new NotFoundException(
        'No such a milestone found with the given id and the logged in freelancer',
      );
    }

    // checks if it's not INPROGRESS
    if (milestone.status !== MilestoneStatus.INPROGRESS) {
      throw new ConflictException(
        `The milestone is ${milestone.status} can't submit to it unless it's still INPROGRESS`,
      );
    }

    const [updatedMilestone] = await this.prisma.$transaction([
      // update milestone status to be INREVIEW and add the submission
      this.prisma.milestone.update({
        where: {
          id: id,
        },
        data: {
          status: MilestoneStatus.INREVIEW,
          submission: {
            create: milestoneSubmissionDto,
          },
        },
      }),
      // update the freelancer wallet decrement workInProgress balance an increment inReview balance
      this.prisma.user.update({
        where: {
          id: freelancerId,
        },
        data: {
          wallet: {
            update: {
              workInProgress: {
                decrement: milestone.amount,
              },
              inReview: {
                increment: milestone.amount,
              },
            },
          },
        },
      }),
    ]);

    return updatedMilestone;
  }

  async acceptSubmission(id: string, clientId: string) {
    // retrieve milestone to check it's status and get the contractId
    const milestone = await this.prisma.milestone.findFirst({
      where: {
        id: id,
        contract: {
          clientId: clientId,
        },
      },
      include: {
        contract: {
          select: {
            freelancerId: true,
          },
        },
      },
    });

    // checks if it's not INREVIEW
    if (milestone.status !== MilestoneStatus.INREVIEW) {
      throw new ConflictException(
        `The milestone is ${milestone.status} can't be released unless it's INREVIEW`,
      );
    }

    const [updatedMilestone] = await this.prisma.$transaction([
      // update milestone status = INPROGRESS
      this.prisma.milestone.update({
        where: {
          id: milestone.id,
        },
        data: {
          status: MilestoneStatus.FULFILLED,
        },
      }),
      // update contract by decrementing the inEscrow amount and increasing the received amount
      this.prisma.contract.update({
        where: {
          id: milestone.contractId,
        },
        data: {
          inEscrowPayment: {
            decrement: milestone.amount,
          },
          receivedPayment: {
            increment: milestone.amount,
          },
        },
      }),
      // update the freelancer wallet decrement inReview balance an increment available balance
      this.prisma.user.update({
        where: {
          id: milestone.contract.freelancerId,
        },
        data: {
          wallet: {
            update: {
              inReview: {
                decrement: milestone.amount,
              },
              available: {
                increment: milestone.amount,
              },
            },
          },
        },
      }),
    ]);

    return updatedMilestone;
  }
}
