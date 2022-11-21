import { Prisma } from '@prisma/client';

export const userIncludeAccount = Prisma.validator<Prisma.UserInclude>()({
  account: {
    select: {
      email: true,
      userName: true,
    },
  },
});
