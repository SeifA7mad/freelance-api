import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteAccountDto } from './dto/delete-account.dto';
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

  private async isUserPasswordCorrect(accountId: string, password: string) {
    const userHashedPassword = await this.prisma.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        password: true,
      },
    });

    return await compare(password, userHashedPassword.password);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const { oldPassword, password, ...accountNewData } = updateAccountDto;

    if (!(await this.isUserPasswordCorrect(id, oldPassword))) {
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

  async delete(id: string, deleteAccountDto: DeleteAccountDto) {
    if (!(await this.isUserPasswordCorrect(id, deleteAccountDto.password))) {
      throw new UnauthorizedException('Incorrect password!');
    }

    await this.prisma.account.delete({
      where: {
        id: id,
      },
    });
  }
}
