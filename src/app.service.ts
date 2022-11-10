import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Prisma, Freelancer } from '@prisma/client';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async freelancers(): Promise<Freelancer[]> {
    return this.prisma.freelancer.findMany();
  }

  async createFreelancer(
    data: Prisma.FreelancerCreateInput,
  ): Promise<Freelancer> {
    return this.prisma.freelancer.create({ data });
  }

  async deleteFreelancers(): Promise<number> {
    const { count } = await this.prisma.freelancer.deleteMany();
    return count;
  }
}
