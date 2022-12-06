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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/guard/client-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { JwtUserRequest } from 'src/util/global-types';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { CreateContractSchema } from './validation/create-contract.validation';
@ApiTags('Contract')
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
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractsService.remove(+id);
  }
}
