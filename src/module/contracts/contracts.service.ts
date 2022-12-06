import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  create(clientId: string, createContractDto: CreateContractDto) {
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
            id: createContractDto.freelancerId,
          },
        },
        job: {
          connect: {
            id_clientId: createContractDto.jobId && {
              id: createContractDto.jobId,
              clientId: clientId,
            },
          },
        },
        project: {
          connect: {
            id_clientId: createContractDto.projectId && {
              id: createContractDto.projectId,
              clientId: clientId,
            },
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all contracts`;
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
