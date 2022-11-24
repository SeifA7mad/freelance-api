export enum UserType {
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export interface UserJwtPayload {
  userId: string;
  username: string;
  email: string;
  userType: UserType;
}
