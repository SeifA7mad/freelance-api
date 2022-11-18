import { Controller, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin-auth.guard';
import { UsersService } from './users.service';
import { ReadPrivilege } from 'src/util/constants';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findAll() {
    return this.usersService.findAll();
  }
}
