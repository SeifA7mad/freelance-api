import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Req,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/guard/client-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { CreateJobSchema } from './validation/create-job';
import { JwtUserRequest } from 'src/util/global-types';
import { UpdateJobSchema } from './validation/update-job';
import { CreateJobInvitationDto } from './dto/create-job-invitation.dto';
import { CreateJobInvitationSchema } from './validation/create-job-invitation';

@ApiTags('Job')
@UseInterceptors(CacheInterceptor)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateJobSchema))
  create(@Req() req: JwtUserRequest, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user.id, createJobDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  findAll(@Req() req: JwtUserRequest) {
    return this.jobsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  findOne(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.jobsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req: JwtUserRequest,
    @Body(new ZodValidationPipe(UpdateJobSchema)) updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, req.user.id, updateJobDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  remove(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.jobsService.remove(id, req.user.id);
  }

  @Post('job-invitation')
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateJobInvitationSchema))
  createJobInvitation(
    @Req() req: JwtUserRequest,
    @Body()
    createJobInvitation: CreateJobInvitationDto,
  ) {
    return this.jobsService.createJobInvitation(
      req.user.id,
      createJobInvitation,
    );
  }
}
