import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // async findAccountByEmail(email: string): Promise<Account | null> {
  //   return this.prisma.account.findUnique({
  //     where: {
  //       email: email,
  //     },
  //     include: {
  //       user: {
  //         include: {
  //           freelancer: true,
  //           client: true,
  //         },
  //       },
  //     },
  //   });
  // }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const { oldPassword, password, ...accountNewData } = updateAccountDto;

    const userHashedPassword = await this.prisma.account.findUnique({
      where: {
        id: id,
      },
      select: {
        password: true,
      },
    });

    if (!(await compare(oldPassword, userHashedPassword.password))) {
      throw new UnauthorizedException('Incorrect password!');
    }

    let newHashedPassword = undefined;
    if (password) {
      newHashedPassword = await hash(password, 12);
    }

    return this.prisma.account.update({
      where: {
        id: id,
      },
      data: { ...accountNewData, password: newHashedPassword },
    });
  }
}
