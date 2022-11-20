import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import {
  ManagePrivilege,
  ReadPrivilege,
  WritePrivilege,
} from 'src/util/constants';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateClientSchema } from './validation/create-client';

@ApiTags('Client')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateClientSchema))
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }
}
