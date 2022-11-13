import { User as UserModel } from '@prisma/client';

// enum UserType {
//   FREELANCER = 'freelancer',
//   CLIENT = 'client',
// }

// type UserTypeStrings = keyof typeof UserType;

export type CreateUserType = Omit<
  UserModel,
  'id' | 'accountId' | 'createdAt' | 'updatedAt'
>;

export class CreateUserDto implements CreateUserType {
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
  timeZone: Date;
}
