import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';

import { FreelancersService } from './freelancers.service';

import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { CreateFreelancerSchema } from './validation/create-freelancer';

import { ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/guard/user-auth-guard';
import { FreelancerAuthGuard } from 'src/guard/freelancer-auth-guard';

@ApiTags('Freelancer')
@Controller('freelancers')
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateFreelancerSchema))
  create(@Body() createFreelancerDto: CreateFreelancerDto) {
    return this.freelancersService.create(createFreelancerDto);
  }

  @Get()
  findAll() {
    return this.freelancersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ) {
    return this.freelancersService.update(+id, updateFreelancerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancersService.remove(+id);
  }
}
