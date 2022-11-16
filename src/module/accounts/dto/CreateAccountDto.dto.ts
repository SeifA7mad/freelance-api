import { Account as AccountModel } from '@prisma/client';

export type CreateAccountType = Omit<AccountModel, 'id' | 'refreshToken'>;

export class CreateAccountDto implements CreateAccountType {
  userName: string;
  email: string;
  password: string;
}
