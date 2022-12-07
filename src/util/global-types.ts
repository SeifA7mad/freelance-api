import { Account, Admin, Client, Freelancer, User } from '@prisma/client';
import { UserType } from 'src/module/auth/dto/user-jwt-payload.interface';

export type UserJwtRequestPayload = User & { userType: UserType } & {
  account: Account;
  freelancer: Freelancer;
  client: Client;
  admin: Admin;
};

export type JwtUserRequest = Request & { user: UserJwtRequestPayload };

export type UserJwtRefreshRequestPayload = User & {
  refreshToken: string;
  userType: UserType;
} & {
  account: Account;
  freelancer: Freelancer;
  client: Client;
  admin: Admin;
};

export type JwtRefreshTokenUserRequest = Request & {
  user: UserJwtRefreshRequestPayload;
};
