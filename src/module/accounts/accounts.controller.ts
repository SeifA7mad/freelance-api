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

// Services imports
import { AccountsService } from './accounts.service';

// Dto's imports
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

// Guards imports
import { UserAuthGuard } from 'src/guard/user-auth.guard';

// Pipes imports
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { UpdateAccountSchema } from './validation/update-account';

// Utils imports
import { JwtUserRequest } from 'src/util/global-types';

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
