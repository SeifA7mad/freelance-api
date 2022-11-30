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
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { FreelancerAuthGuard } from 'src/guard/freelancer-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { CreateProposalSchema } from './validation/create-proposal';
import { JwtUserRequest } from 'src/util/global-types';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProposalSchema } from './validation/update-proposal';

@ApiTags('Proposal')
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @UseGuards(FreelancerAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateProposalSchema))
  create(
    @Req() req: JwtUserRequest,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    return this.proposalsService.create(req.user.id, createProposalDto);
  }

  @Get()
  @UseGuards(FreelancerAuthGuard)
  findAll(@Req() req: JwtUserRequest) {
    return this.proposalsService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(FreelancerAuthGuard)
  findOne(@Req() req: JwtUserRequest, @Param('id') id: string) {
    return this.proposalsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(FreelancerAuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProposalSchema))
    updateProposalDto: UpdateProposalDto,
    @Req() req: JwtUserRequest,
  ) {
    return this.proposalsService.update(id, req.user.id, updateProposalDto);
  }

  @Delete(':id')
  @UseGuards(FreelancerAuthGuard)
  remove(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.proposalsService.remove(id, req.user.id);
  }
}
