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
    const { user: userData, ...freelancerData } = createFreelancerDto;
    const { account: accountData } = userData;

    const hashedPassword = await hash(accountData.password, 12);

    return this.prisma.freelancer.create({
      data: {
        jobTitle: freelancerData.jobTitle,
        jobCategory: freelancerData.jobCategory,
        experienceLevel: freelancerData.experienceLevel,
        user: {
          create: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            timeZone: userData.timeZone,
            bio: userData.bio,
            profilePicture: userData.profilePicture,
            client: undefined,
            admin: undefined,
            account: {
              create: {
                email: accountData.email,
                password: hashedPassword,
                userName: accountData.userName,
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

  findOne(id: string) {
    return this.prisma.freelancer.findUnique({
      where: {
        id: id,
      },
      include: {
        freelancerSkills: {
          include: {
            skill: true,
          },
        },
        contracts: true,
        proposals: true,
        jobInvitations: true,
      },
    });
  }

  update(id: string, updateFreelancerDto: UpdateFreelancerDto) {
    return this.prisma.freelancer.update({
      where: {
        id: id,
      },
      data: updateFreelancerDto,
    });
  }
}
