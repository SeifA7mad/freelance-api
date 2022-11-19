import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, CreateUserType } from './create-user.dto';

export type UpdateUserType = CreateUserType;

export class UpdateUserDto extends PartialType(CreateUserDto) {}
