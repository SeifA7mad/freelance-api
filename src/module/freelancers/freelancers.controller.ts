import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';

import { FreelancersService } from './freelancers.service';

import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { CreateFreelancerSchema } from './validation/create-freelancer';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin-auth.guard';
import {
  ReadPrivilege,
  ManagePrivilege,
  WritePrivilege,
} from 'src/util/constants';
import { FreelancerAuthGuard } from 'src/guard/freelancer-auth.guard';
import { JwtUserRequest } from 'src/util/global-types';

@ApiTags('Freelancer')
@Controller('freelancers')
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateFreelancerSchema))
  create(@Body() createFreelancerDto: CreateFreelancerDto) {
    return this.freelancersService.create(createFreelancerDto);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findAll() {
    return this.freelancersService.findAll();
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findOne(@Param('id') id: string) {
    return this.freelancersService.findOne(id);
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(WritePrivilege))
  updateAdmin(
    @Param('id') id: string,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ) {
    return this.freelancersService.update(id, updateFreelancerDto);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(FreelancerAuthGuard)
  update(
    @Req() req: JwtUserRequest,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ) {
    return this.freelancersService.update(req.user.id, updateFreelancerDto);
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ManagePrivilege))
  remove(@Param('id') id: string) {
    return this.freelancersService.remove(id);
  }
}
