import { DiscountType, PromoCode } from '@prisma/client';

export interface PromoValidation {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  description: string;
}

export interface PromoCodesPage {
  data: PromoCode[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
