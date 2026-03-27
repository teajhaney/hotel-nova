import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscountType, PromoStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PromoCodesService } from './promo-codes.service';

const mockPromo = {
  id: 'promo-1',
  code: 'GRAND25',
  description: '25% off all suites',
  discountType: DiscountType.percentage,
  discountValue: 25,
  usageLimit: 100,
  used: 10,
  validFrom: new Date(Date.now() - 86400000), // yesterday
  validTo: new Date(Date.now() + 86400000), // tomorrow
  status: PromoStatus.Active,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  promoCode: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PromoCodesService', () => {
  let service: PromoCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoCodesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PromoCodesService>(PromoCodesService);
    jest.clearAllMocks();
  });

  // ─── listPromoCodes ──────────────────────────────────────────────────────────

  describe('listPromoCodes', () => {
    it('returns paginated promo codes', async () => {
      mockPrisma.promoCode.count.mockResolvedValue(1);
      mockPrisma.promoCode.findMany.mockResolvedValue([mockPromo]);

      const result = await service.listPromoCodes({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  // ─── createPromoCode ─────────────────────────────────────────────────────────

  describe('createPromoCode', () => {
    const dto = {
      code: 'SAVE20',
      description: '20% off',
      discountType: DiscountType.percentage,
      discountValue: 20,
      usageLimit: 50,
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
    };

    it('creates a promo code and uppercases the code', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(null);
      mockPrisma.promoCode.create.mockResolvedValue({
        ...mockPromo,
        code: 'SAVE20',
      });

      const result = await service.createPromoCode(dto);

      const [callArg] = mockPrisma.promoCode.create.mock.calls[0] as [
        { data: { code: string } },
      ];
      expect(callArg.data.code).toBe('SAVE20');
      expect(result.code).toBe('SAVE20');
    });

    it('throws ConflictException when code already exists', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(mockPromo);

      await expect(service.createPromoCode(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ─── updatePromoCode ─────────────────────────────────────────────────────────

  describe('updatePromoCode', () => {
    it('updates the promo code', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(mockPromo);
      mockPrisma.promoCode.update.mockResolvedValue({
        ...mockPromo,
        usageLimit: 200,
      });

      const result = await service.updatePromoCode('promo-1', {
        usageLimit: 200,
      });

      expect(result.usageLimit).toBe(200);
    });

    it('throws NotFoundException when promo code not found', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(null);

      await expect(
        service.updatePromoCode('ghost', { usageLimit: 200 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── deletePromoCode ─────────────────────────────────────────────────────────

  describe('deletePromoCode', () => {
    it('deletes the promo code', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(mockPromo);
      mockPrisma.promoCode.delete.mockResolvedValue(mockPromo);

      await service.deletePromoCode('promo-1');

      expect(mockPrisma.promoCode.delete).toHaveBeenCalledWith({
        where: { id: 'promo-1' },
      });
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(null);

      await expect(service.deletePromoCode('ghost')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── validatePromoCode ───────────────────────────────────────────────────────

  describe('validatePromoCode', () => {
    it('returns discount info for a valid code', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue(mockPromo);

      const result = await service.validatePromoCode('GRAND25');

      expect(result.discountType).toBe(DiscountType.percentage);
      expect(result.discountValue).toBe(25);
    });

    it('throws BadRequestException for expired code', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue({
        ...mockPromo,
        validTo: new Date(Date.now() - 1000),
      });

      await expect(service.validatePromoCode('GRAND25')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when limit reached', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue({
        ...mockPromo,
        used: 100,
        usageLimit: 100,
      });

      await expect(service.validatePromoCode('GRAND25')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for inactive code', async () => {
      mockPrisma.promoCode.findUnique.mockResolvedValue({
        ...mockPromo,
        status: PromoStatus.Inactive,
      });

      await expect(service.validatePromoCode('GRAND25')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
