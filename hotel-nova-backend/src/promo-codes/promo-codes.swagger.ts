import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

type Decorator = MethodDecorator & ClassDecorator;

export const ApiListPromoCodes = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Admin: list all promo codes with optional status filter' }));

export const ApiCreatePromoCode = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Admin: create a new promo code' }));

export const ApiUpdatePromoCode = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Admin: update a promo code' }));

export const ApiDeletePromoCode = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Admin: permanently delete a promo code' }));

export const ApiValidatePromoCode = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Validate a promo code and return discount info' }));
