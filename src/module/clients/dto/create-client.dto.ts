import { CreateAccountType } from 'src/module/accounts/dto/CreateAccountDto.dto';
import { CreateUserType } from 'src/module/users/dto/CreateUserDto.dto';
import { Client } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export type CreateClientType = Omit<Client, 'id'> &
  CreateUserType &
  CreateAccountType;

export class CreateClientDto implements CreateClientType {
  firstName: string;
  lastName: string;
  @ApiProperty({ required: false })
  bio: string;
  @ApiProperty({ required: false })
  profilePicture: string;
  timeZone: Date;
  userName: string;
  email: string;
  password: string;
}
