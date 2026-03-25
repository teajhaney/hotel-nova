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

// All fields are optional — only the fields you send are updated.
export class UpdatePromoCodeDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]+$/, { message: 'Code must be uppercase letters and numbers only' })
  code?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsIn(['percentage', 'fixed'])
  discountType?: DiscountType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  discountValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validTo?: string;

  @IsOptional()
  @IsIn(['Active', 'Inactive', 'Scheduled'])
  status?: PromoStatus;
}
