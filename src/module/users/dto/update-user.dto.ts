import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

const updateUserArgs = Prisma.validator<Prisma.UserArgs>()({
  select: {
    firstName: true,
    lastName: true,
    bio: true,
    profilePicture: true,
    timeZone: true,
  },
});

export type updateUserType = Prisma.UserGetPayload<typeof updateUserArgs>;

class UpdateUser implements updateUserType {
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
  timeZone: Date;
}

export class UpdateUserDto extends PartialType(UpdateUser) {}
