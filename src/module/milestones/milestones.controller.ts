import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { ClientAuthGuard } from 'src/guard/client-auth.guard';
import { Req, UsePipes } from '@nestjs/common/decorators';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMilestoneSchema } from './validation/create-milestone.validation';
import { UserExceptAdminAuthGuard } from 'src/guard/user-except-admin-auth.guard';
import { JwtUserRequest } from 'src/util/global-types';
import { FreelancerAuthGuard } from 'src/guard/freelancer-auth.guard';
import { MilestoneSubmissionDto } from './dto/submit-milestone.dto';
import { MilestoneSubmissionSchema } from './validation/submit-milestone.validation';

@ApiTags('Milestone')
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateMilestoneSchema))
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.create(createMilestoneDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserExceptAdminAuthGuard)
  @Get(':contractId')
  findAll(@Param('contractId') contractId: string, @Req() req: JwtUserRequest) {
    return this.milestonesService.findAll(contractId, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(UserExceptAdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.milestonesService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.milestonesService.update(id, updateMilestoneDto);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Patch('activate/:id')
  activate(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.milestonesService.activate(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(FreelancerAuthGuard)
  @Patch('submit/:id')
  submit(
    @Param('id') id: string,
    @Req() req: JwtUserRequest,
    @Body(new ZodValidationPipe(MilestoneSubmissionSchema))
    milestoneSubmissionDto: MilestoneSubmissionDto,
  ) {
    return this.milestonesService.submit(
      id,
      req.user.id,
      milestoneSubmissionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milestonesService.remove(+id);
  }
}
