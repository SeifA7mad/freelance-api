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
  findAll() {
    return this.proposalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proposalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    return this.proposalsService.update(+id, updateProposalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proposalsService.remove(+id);
  }
}
