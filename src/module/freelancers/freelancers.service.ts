import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { FindAllQueryParamsDto } from './dto/findAll-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import {
  freelancerIncludeAll,
  userIncludeAccount,
} from 'src/prisma/prisma-validator';
import { UpdateFreelancerSkillsDto } from './dto/update-skills.dto';

@Injectable()
export class FreelancersService {
  constructor(private readonly prisma: PrismaService) {}

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
            wallet: {
              create: {},
            },
          },
        },
      },
      include: {
        user: {
          include: userIncludeAccount,
        },
      },
    });
  }

  async findAll(query: FindAllQueryParamsDto) {
    const { limit, page } = query;

    const numberToSkip = limit * (page - 1) || undefined;

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.freelancer.count(),
      this.prisma.freelancer.findMany({
        take: limit,
        skip: numberToSkip,
        include: {
          user: {
            include: userIncludeAccount,
          },
        },
      }),
    ]);

    return { totalCount, data };
  }

  findOne(id: string) {
    return this.prisma.freelancer.findUnique({
      where: {
        id: id,
      },
      include: freelancerIncludeAll,
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

  async updateSkills(
    id: string,
    updateFreelancerSkillsDto: UpdateFreelancerSkillsDto,
  ) {
    await this.prisma.freelancer.update({
      where: {
        id: id,
      },
      data: {
        freelancerSkills: {
          deleteMany: {},
        },
      },
    });

    return this.prisma.freelancer.update({
      where: {
        id: id,
      },
      data: {
        freelancerSkills: {
          createMany: {
            data: updateFreelancerSkillsDto.freelancerSkills,
            skipDuplicates: true,
          },
        },
      },
      include: freelancerIncludeAll,
    });
  }
}
