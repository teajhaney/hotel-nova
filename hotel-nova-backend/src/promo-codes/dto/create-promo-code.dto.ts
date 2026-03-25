import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType, PromoStatus } from '@prisma/client';

export class CreatePromoCodeDto {
  @IsString()
  @Matches(/^[A-Z0-9]+$/, { message: 'Code must be uppercase letters and numbers only' })
  code: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsIn(['percentage', 'fixed'])
  discountType: DiscountType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  discountValue: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  usageLimit: number;

  @IsString()
  validFrom: string; // ISO date string

  @IsString()
  validTo: string; // ISO date string

  @IsOptional()
  @IsIn(['Active', 'Inactive', 'Scheduled'])
  status?: PromoStatus;
}
