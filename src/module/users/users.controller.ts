import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
