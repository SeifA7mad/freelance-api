import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class FindAllQueryParamsNonRequired {
  @IsNumber()
  page: number;
  @IsNumber()
  limit: number;
}

export class FindAllQueryParamsDto extends PartialType(
  FindAllQueryParamsNonRequired,
) {}
