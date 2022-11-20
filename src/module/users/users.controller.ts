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
import { Query, ValidationPipe } from '@nestjs/common';

import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { UpdateUserSchema } from './validation/update-user';
import { FindAllQueryParamsDto } from './dto/findAll-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  findAll(@Query() query: FindAllQueryParamsDto) {
    return this.usersService.findAll(query);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  update(@Req() req: JwtUserRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
