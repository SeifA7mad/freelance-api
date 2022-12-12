import { ApiProperty } from '@nestjs/swagger';

export class MakeDepositDto {
  @ApiProperty({
    description:
      'A positive integer representing how much to charge in the smallest currency unit (e.g., 100 cents to charge $1.00)',
  })
  amount: number;
  paymentMethodId: string;
}
