import {
  Controller,
  UseGuards,
  UsePipes,
  Get,
  Patch,
  Req,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin-auth.guard';
import { UsersService } from './users.service';
import { ReadPrivilege } from 'src/util/constants';
import { JwtUserRequest } from 'src/util/global-types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { UpdateUserSchema } from './validation/update-user';

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

  @Patch()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  update(@Req() req: JwtUserRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
