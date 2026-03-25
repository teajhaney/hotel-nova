import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PromoStatus } from '@prisma/client';

export class ListPromoCodesDto {
  @IsOptional()
  @IsIn(['Active', 'Inactive', 'Scheduled'])
  status?: PromoStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
