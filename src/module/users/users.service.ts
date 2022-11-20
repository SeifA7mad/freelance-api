import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllQueryParamsDto } from './dto/findAll-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindAllQueryParamsDto) {
    const { limit, page } = query;

    const numberToSkip = limit * (page - 1) || undefined;

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take: limit,
        skip: numberToSkip,
        include: {
          account: true,
          freelancer: true,
          client: true,
          admin: true,
        },
      }),
    ]);

    return { totalCount, data };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }
}
