import { Prisma } from '@prisma/client';

const createAccountArgs = Prisma.validator<Prisma.AccountArgs>()({
  select: {
    userName: true,
    email: true,
    password: true,
  },
});

export type createAccountType = Prisma.AccountGetPayload<
  typeof createAccountArgs
>;

export class CreateAccountDto implements createAccountType {
  userName: string;
  email: string;
  password: string;
}
