import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

import { hash } from 'bcryptjs';
import { userIncludeAccount } from 'src/prisma/prisma-validator';
import { FindAllQueryParamsDto } from './dto/findAll-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const { user: userData, ...clientData } = createClientDto;
    const { account: accountData } = userData;

    const hashedPassword = await hash(accountData.password, 12);
    return this.prisma.client.create({
      data: {
        user: {
          create: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            timeZone: userData.timeZone,
            bio: userData.bio,
            profilePicture: userData.profilePicture,
            freelancer: undefined,
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
          include: userIncludeAccount,
        },
      },
    });
  }

  async findAll(query: FindAllQueryParamsDto) {
    const { limit, page } = query;

    const numberToSkip = limit * (page - 1) || undefined;

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.client.count(),
      this.prisma.client.findMany({
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

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: {
        id: id,
      },
      include: {
        contracts: true,
        jobs: true,
        project: true,
        user: {
          include: userIncludeAccount,
        },
      },
    });
  }
}
