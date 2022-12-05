import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { JwtUserRequest } from 'src/util/global-types';

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
}
