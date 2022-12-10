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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/guard/client-auth.guard';
import { FreelancerAuthGuard } from 'src/guard/freelancer-auth.guard';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { UserExceptAdminAuthGuard } from 'src/guard/user-except-admin-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { JwtUserRequest } from 'src/util/global-types';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { CreateContractSchema } from './validation/create-contract.validation';
@ApiTags('Contract')
@UseInterceptors(CacheInterceptor)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateContractSchema))
  create(
    @Req() req: JwtUserRequest,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractsService.create(req.user.id, createContractDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(UserExceptAdminAuthGuard)
  findAll(@Req() req: JwtUserRequest) {
    return this.contractsService.findAll(req.user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(UserExceptAdminAuthGuard)
  findOne(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.contractsService.findOne(id, req.user);
  }

  @Patch('accept/:id')
  @ApiBearerAuth()
  @UseGuards(FreelancerAuthGuard)
  acceptContract(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.contractsService.acceptContract(id, req.user.id);
  }

  @Patch('end/:id')
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  endContract(@Param('id') id: string, @Req() req: JwtUserRequest) {
    return this.contractsService.endContract(id, req.user.id);
  }
}
