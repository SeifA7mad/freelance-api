import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { hash } from 'bcryptjs';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const hashedPassword = await hash(createClientDto.password, 12);
    return this.prisma.client.create({
      data: {
        user: {
          create: {
            firstName: createClientDto.firstName,
            lastName: createClientDto.lastName,
            timeZone: createClientDto.timeZone,
            bio: createClientDto.bio,
            profilePicture: createClientDto.profilePicture,
            freelancer: undefined,
            admin: undefined,
            account: {
              create: {
                email: createClientDto.email,
                password: hashedPassword,
                userName: createClientDto.userName,
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
    return `This action returns a #${id} client`;
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: string) {
    return `This action removes a #${id} client`;
  }
}
