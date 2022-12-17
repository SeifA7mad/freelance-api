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
import { UsePipes } from '@nestjs/common/decorators';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMilestoneSchema } from './validation/create-milestone.validation';
import { UserExceptAdminAuthGuard } from 'src/guard/user-except-admin-auth.guard';

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
  findAll(@Param('contractId') contractId: string) {
    return this.milestonesService.findAll(contractId);
  }

  @ApiBearerAuth()
  @UseGuards(UserExceptAdminAuthGuard)
  @Get(':contractId/:id')
  findOne(@Param('id') id: string, @Param('contractId') contractId: string) {
    return this.milestonesService.findOne(id, contractId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.milestonesService.update(+id, updateMilestoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milestonesService.remove(+id);
  }
}
