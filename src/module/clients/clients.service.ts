import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

import { hash } from 'bcryptjs';

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
          include: {
            account: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.client.findMany({
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
    return this.prisma.client.findUnique({
      where: {
        id: id,
      },
      include: {
        contracts: true,
        jobs: true,
      },
    });
  }
}
