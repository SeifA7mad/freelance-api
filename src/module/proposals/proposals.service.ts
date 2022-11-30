import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  create(freelancerId: string, createProposalDto: CreateProposalDto) {
    return this.prisma.proposal.create({
      data: {
        bid: createProposalDto.bid,
        coverLetter: createProposalDto.coverLetter,
        projectLength: createProposalDto.projectLength,
        attachments: {
          createMany: {
            data: createProposalDto.attachments,
            skipDuplicates: true,
          },
        },
        job: {
          connect: {
            id: createProposalDto.jobId,
          },
        },
        freelancer: {
          connect: {
            id: freelancerId,
          },
        },
      },
      include: {
        attachments: true,
      },
    });
  }

  findAll(freelancerId: string) {
    return this.prisma.proposal.findMany({
      where: {
        freelancerId: freelancerId,
      },
    });
  }

  findOne(id: string, freelancerId: string) {
    return this.prisma.proposal.findUnique({
      where: {
        freelancerId_id: {
          id: id,
          freelancerId: freelancerId,
        },
      },
      include: {
        attachments: {
          select: {
            url: true,
          },
        },
        job: true,
      },
    });
  }

  update(
    id: string,
    freelancerId: string,
    updateProposalDto: UpdateProposalDto,
  ) {
    const createAttachments = updateProposalDto.attachments && {
      createMany: {
        data: updateProposalDto.attachments,
      },
    };
    return this.prisma.proposal.update({
      where: {
        freelancerId_id: {
          id: id,
          freelancerId: freelancerId,
        },
      },
      data: {
        bid: updateProposalDto.bid,
        coverLetter: updateProposalDto.coverLetter,
        projectLength: updateProposalDto.projectLength,
        attachments: createAttachments,
      },
      include: {
        attachments: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  remove(id: string, freelancerId: string) {
    return this.prisma.proposal.delete({
      where: {
        freelancerId_id: {
          id: id,
          freelancerId: freelancerId,
        },
      },
    });
  }
}
