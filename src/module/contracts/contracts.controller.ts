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
  Query,
  ValidationPipe,
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
import { AddFundsDto } from './dto/add-funds.dto';
import { AddFundsSchema } from './validation/add-funds.validation';
import { FindAllQueryParamsDto } from './dto/findAll-contracts.dto';
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
  findAll(
    @Req() req: JwtUserRequest,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: FindAllQueryParamsDto,
  ) {
    return this.contractsService.findAll(req.user, query);
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

  @Patch('add-funds/:id')
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  addFunds(
    @Param('id') id: string,
    @Req() req: JwtUserRequest,
    @Body(new ZodValidationPipe(AddFundsSchema)) addFundsDto: AddFundsDto,
  ) {
    return this.contractsService.addFunds(id, req.user.id, addFundsDto);
  }
}
