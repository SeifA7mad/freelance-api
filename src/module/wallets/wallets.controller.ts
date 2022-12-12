import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  UsePipes,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { JwtUserRequest } from 'src/util/global-types';
import { MakeDepositDto } from './dto/make-deposit.dto';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { MakeDepositSchema } from './validation/make-deposit.validation';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  getWallet(@Req() req: JwtUserRequest) {
    return this.walletsService.getWallet(req.user.id);
  }

  @Post('deposit')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ZodValidationPipe(MakeDepositSchema))
  deposit(@Req() req: JwtUserRequest, @Body() depositDto: MakeDepositDto) {
    return this.walletsService.deposit(req.user.id, depositDto);
  }
}
