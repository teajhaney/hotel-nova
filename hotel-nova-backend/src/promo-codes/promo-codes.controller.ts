import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin } from '../auth/decorators/admin.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { ListPromoCodesDto } from './dto/list-promo-codes.dto';
import {
  ApiCreatePromoCode,
  ApiDeletePromoCode,
  ApiListPromoCodes,
  ApiUpdatePromoCode,
  ApiValidatePromoCode,
} from './promo-codes.swagger';

@ApiTags('Promo Codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private promoCodesService: PromoCodesService) {}

  // GET /api/v1/promo-codes → NestJS GET /api/v1/promo-codes
  // Admin: returns paginated promo codes with optional status filter.
  @Admin()
  @Get()
  @ApiListPromoCodes()
  listPromoCodes(@Query() query: ListPromoCodesDto) {
    return this.promoCodesService.listPromoCodes(query);
  }

  // POST /api/v1/promo-codes → NestJS POST /api/v1/promo-codes
  // Admin: create a new promo code.
  @Admin()
  @Post()
  @ApiCreatePromoCode()
  createPromoCode(@Body() dto: CreatePromoCodeDto) {
    return this.promoCodesService.createPromoCode(dto);
  }

  // PATCH /api/v1/promo-codes/:id → NestJS PATCH /api/v1/promo-codes/:id
  // Admin: update an existing promo code.
  @Admin()
  @Patch(':id')
  @ApiUpdatePromoCode()
  updatePromoCode(@Param('id') id: string, @Body() dto: UpdatePromoCodeDto) {
    return this.promoCodesService.updatePromoCode(id, dto);
  }

  // DELETE /api/v1/promo-codes/:id → NestJS DELETE /api/v1/promo-codes/:id
  // Admin: permanently delete a promo code.
  @Admin()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeletePromoCode()
  deletePromoCode(@Param('id') id: string) {
    return this.promoCodesService.deletePromoCode(id);
  }

  // POST /api/v1/promo-codes/validate → NestJS POST /api/v1/promo-codes/validate
  // Public: validate a promo code during booking checkout.
  @Public()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiValidatePromoCode()
  validatePromoCode(@Body('code') code: string) {
    return this.promoCodesService.validatePromoCode(code);
  }
}
