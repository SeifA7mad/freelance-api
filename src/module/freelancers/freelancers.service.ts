import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';

@Injectable()
export class FreelancersService {
  constructor(private prisma: PrismaService) {}

  async create(createFreelancerDto: CreateFreelancerDto) {
    const hashedPassword = await hash(createFreelancerDto.password, 12);
    return this.prisma.freelancer.create({
      data: {
        jobTitle: createFreelancerDto.jobTitle,
        jobCategory: createFreelancerDto.jobCategory,
        experienceLevel: createFreelancerDto.experienceLevel,
        user: {
          create: {
            firstName: createFreelancerDto.firstName,
            lastName: createFreelancerDto.lastName,
            timeZone: createFreelancerDto.timeZone,
            bio: createFreelancerDto.bio,
            profilePicture: createFreelancerDto.profilePicture,
            client: undefined,
            account: {
              create: {
                email: createFreelancerDto.email,
                password: hashedPassword,
                userName: createFreelancerDto.userName,
              },
            },
          },
        },
      },
      include: {
        user: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.freelancer.findMany({
      include: {
        user: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} freelancer`;
  }

  update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    return `This action updates a #${id} freelancer`;
  }

  remove(id: number) {
    return `This action removes a #${id} freelancer`;
  }
}
