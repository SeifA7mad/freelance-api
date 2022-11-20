import {
  Body,
  Controller,
  Delete,
  Patch,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { JwtUserRequest } from 'src/util/global-types';
import { AccountsService } from './accounts.service';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdateAccountSchema } from './validation/update-account';

@ApiTags('Account')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Patch()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @UsePipes(new ZodValidationPipe(UpdateAccountSchema))
  update(
    @Req() req: JwtUserRequest,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(req.user.accountId, updateAccountDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  delete(
    @Req() req: JwtUserRequest,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.accountsService.delete(req.user.accountId, deleteAccountDto);
  }
}
