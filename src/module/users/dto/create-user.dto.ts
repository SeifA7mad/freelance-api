import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateAccountDto } from 'src/module/accounts/dto/create-account.dto';

const createUserWithAccountArgs = Prisma.validator<Prisma.UserArgs>()({
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
});

export type createUserWithAccountType = Prisma.UserGetPayload<
  typeof createUserWithAccountArgs
>;

export class CreateUserDto implements createUserWithAccountType {
  firstName: string;
  lastName: string;
  @ApiProperty({ required: false })
  bio: string;
  @ApiProperty({ required: false })
  profilePicture: string;
  timeZone: Date;
  @ApiProperty({ type: () => CreateAccountDto })
  account: CreateAccountDto;
}
