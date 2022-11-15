import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
