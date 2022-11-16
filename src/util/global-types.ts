import { Account, User } from '@prisma/client';

export type JwtUserRequest = Request & { user: User & { account: Account } };

export type JwtRefreshTokenUserRequest = Request & {
  user: User & { refreshToken: string } & { account: Account };
};
