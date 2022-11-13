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
    try {
      const hashedPassword = await hash(createFreelancerDto.password, 12);
      const newCreatedUser = await this.prisma.freelancer.create({
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

      return newCreatedUser;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (err.code === 'P2002') {
          throw new ConflictException(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
      }
    }
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
