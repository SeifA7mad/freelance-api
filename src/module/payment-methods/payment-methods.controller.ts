import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import { JwtUserRequest } from 'src/util/global-types';

// imports Services
import { PaymentMethodsService } from './payment-methods.service';

// imports DTO's
import { CreateCardPaymentMethodDto } from './dto/create-payment-method.dto';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { createCardPaymentMethodSchema } from './validation/create-card';

@ApiTags('Payment Methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post('cards')
  @UseGuards(UserAuthGuard)
  @UsePipes(new ZodValidationPipe(createCardPaymentMethodSchema))
  createCardPaymentMethod(
    @Req() req: JwtUserRequest,
    @Body() createCardPaymentMethodDto: CreateCardPaymentMethodDto,
  ) {
    return this.paymentMethodsService.createCardMethod(
      createCardPaymentMethodDto,
      req.user.id,
    );
  }

  @Get()
  @UseGuards(UserAuthGuard)
  findAll(@Req() req: JwtUserRequest) {
    return this.paymentMethodsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  // ) {
  //   return this.paymentMethodsService.update(+id, updatePaymentMethodDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
  }
}
