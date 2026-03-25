import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PromoCode, PromoStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PROMO_MESSAGES } from '../common/constants/messages';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { ListPromoCodesDto } from './dto/list-promo-codes.dto';
import type {
  PromoCodesPage,
  PromoValidation,
} from './interfaces/promo-code.interface';

@Injectable()
export class PromoCodesService {
  constructor(private prisma: PrismaService) {}

  // ─── Admin: List Promo Codes ───────────────────────────────────────────────
  // Paginated list with optional status filter.
  async listPromoCodes(filters: ListPromoCodesDto): Promise<PromoCodesPage> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where = filters.status ? { status: filters.status } : {};

    const [total, data] = await Promise.all([
      this.prisma.promoCode.count({ where }),
      this.prisma.promoCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Admin: Create Promo Code ─────────────────────────────────────────────
  // Creates a new promo code. The code is normalised to uppercase before saving.
  async createPromoCode(dto: CreatePromoCodeDto): Promise<PromoCode> {
    const code = dto.code.toUpperCase();

    const existing = await this.prisma.promoCode.findUnique({
      where: { code },
    });
    if (existing)
      throw new ConflictException(PROMO_MESSAGES.CODE_ALREADY_EXISTS);

    return this.prisma.promoCode.create({
      data: {
        code,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        usageLimit: dto.usageLimit,
        validFrom: new Date(dto.validFrom),
        validTo: new Date(dto.validTo),
        status: dto.status ?? PromoStatus.Active,
      },
    });
  }

  // ─── Admin: Update Promo Code ─────────────────────────────────────────────
  // Only the fields present in the DTO are updated.
  // If the code is being changed, we check uniqueness first.
  async updatePromoCode(
    id: string,
    dto: UpdatePromoCodeDto,
  ): Promise<PromoCode> {
    const existing = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(PROMO_MESSAGES.PROMO_NOT_FOUND);

    if (dto.code) {
      const normalised = dto.code.toUpperCase();
      if (normalised !== existing.code) {
        const codeExists = await this.prisma.promoCode.findUnique({
          where: { code: normalised },
        });
        if (codeExists)
          throw new ConflictException(PROMO_MESSAGES.CODE_ALREADY_EXISTS);
      }
      dto.code = normalised;
    }

    return this.prisma.promoCode.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.discountType !== undefined && {
          discountType: dto.discountType,
        }),
        ...(dto.discountValue !== undefined && {
          discountValue: dto.discountValue,
        }),
        ...(dto.usageLimit !== undefined && { usageLimit: dto.usageLimit }),
        ...(dto.validFrom !== undefined && {
          validFrom: new Date(dto.validFrom),
        }),
        ...(dto.validTo !== undefined && { validTo: new Date(dto.validTo) }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  // ─── Admin: Delete Promo Code ─────────────────────────────────────────────
  // Permanently removes the promo code. Bookings that used it are unaffected
  // (the FK is nullable and the discount amounts are already persisted).
  async deletePromoCode(id: string): Promise<void> {
    const existing = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(PROMO_MESSAGES.PROMO_NOT_FOUND);

    await this.prisma.promoCode.delete({ where: { id } });
  }

  // ─── Guest/Public: Validate Promo Code ────────────────────────────────────
  // Checks that a code is Active, within its validity dates, and has not
  // reached its usage limit. Returns the discount info so the booking form
  // can show the guest how much they'll save.
  async validatePromoCode(code: string): Promise<PromoValidation> {
    const promo = await this.prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    const now = new Date();

    if (
      !promo ||
      promo.status !== PromoStatus.Active ||
      promo.validFrom > now ||
      promo.validTo < now
    ) {
      throw new BadRequestException(PROMO_MESSAGES.INVALID_PROMO_CODE);
    }

    if (promo.used >= promo.usageLimit) {
      throw new BadRequestException(PROMO_MESSAGES.PROMO_CODE_LIMIT_REACHED);
    }

    return {
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      description: promo.description,
    };
  }
}
