import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/module/users/dto/create-user.dto';

const createClientWithUserAccountArgs = Prisma.validator<Prisma.ClientArgs>()({
  select: {
    user: {
      select: {
        account: {
          select: {
            userName: true,
            email: true,
            password: true,
          },
        },
        firstName: true,
        lastName: true,
        bio: true,
        profilePicture: true,
        timeZone: true,
      },
    },
  },
});

export type createClientWithUserAccountType = Prisma.ClientGetPayload<
  typeof createClientWithUserAccountArgs
>;
export class CreateClientDto implements createClientWithUserAccountType {
  @ApiProperty({ type: () => CreateUserDto })
  user: CreateUserDto;
}
