import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

const mockNotification = {
  id: 'notif-1',
  userId: 'user-1',
  bookingId: 'booking-1',
  type: 'booking_confirmed' as const,
  title: 'Booking Confirmed',
  message: 'Your booking BK-001 is confirmed.',
  actionLabel: 'View Booking',
  actionHref: '/dashboard/guest/history',
  read: false,
  archived: false,
  createdAt: new Date(),
};

const mockPrisma = {
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('persists a notification and returns it', async () => {
      mockPrisma.notification.create.mockResolvedValue(mockNotification);

      const result = await service.create({
        userId: 'user-1',
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your booking BK-001 is confirmed.',
        bookingId: 'booking-1',
        actionLabel: 'View Booking',
        actionHref: '/dashboard/guest/history',
      });

      expect(result).toEqual(mockNotification);
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          userId: 'user-1',
          type: 'booking_confirmed',
        }),
      });
    });
  });

  // ─── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns paginated notifications defaulting to non-archived', async () => {
      mockPrisma.notification.count.mockResolvedValue(1);
      mockPrisma.notification.findMany.mockResolvedValue([mockNotification]);

      const result = await service.findAll('user-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', archived: false },
        }),
      );
    });

    it('filters by type and read status', async () => {
      mockPrisma.notification.count.mockResolvedValue(0);
      mockPrisma.notification.findMany.mockResolvedValue([]);

      await service.findAll('user-1', {
        type: 'payment_received',
        read: false,
      });

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: 'user-1',
            type: 'payment_received',
            read: false,
            archived: false,
          },
        }),
      );
    });
  });

  // ─── unreadCount ────────────────────────────────────────────────────────────

  describe('unreadCount', () => {
    it('returns the count of unread, non-archived notifications', async () => {
      mockPrisma.notification.count.mockResolvedValue(3);

      const result = await service.unreadCount('user-1');

      expect(result).toBe(3);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', read: false, archived: false },
      });
    });
  });

  // ─── markRead ───────────────────────────────────────────────────────────────

  describe('markRead', () => {
    it('marks a notification as read', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.update.mockResolvedValue({
        ...mockNotification,
        read: true,
      });

      const result = await service.markRead('notif-1', 'user-1');

      expect(result.read).toBe(true);
    });

    it('throws NotFoundException for non-existent notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.markRead('bad-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ForbiddenException if notification belongs to another user', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        ...mockNotification,
        userId: 'other-user',
      });

      await expect(service.markRead('notif-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── markAllRead ────────────────────────────────────────────────────────────

  describe('markAllRead', () => {
    it('returns the count of updated rows', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllRead('user-1');

      expect(result).toBe(5);
      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', read: false, archived: false },
        data: { read: true },
      });
    });
  });

  // ─── archive ────────────────────────────────────────────────────────────────

  describe('archive', () => {
    it('archives a notification and marks it read', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.update.mockResolvedValue({
        ...mockNotification,
        archived: true,
        read: true,
      });

      const result = await service.archive('notif-1', 'user-1');

      expect(result.archived).toBe(true);
      expect(result.read).toBe(true);
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { archived: true, read: true },
      });
    });

    it('throws ForbiddenException if not the owner', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        ...mockNotification,
        userId: 'other-user',
      });

      await expect(service.archive('notif-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
