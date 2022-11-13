import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/CreateAccountDto.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAccountByEmail(email: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        email: email,
      },
      include: {
        user: {
          include: {
            freelancer: true,
            client: true,
          },
        },
      },
    });
  }
}
