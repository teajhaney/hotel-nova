import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const mockNotification = {
  id: 'notif-1',
  userId: 'user-1',
  bookingId: null,
  type: 'general' as const,
  title: 'Welcome',
  message: 'Welcome to Hotel Nova!',
  actionLabel: null,
  actionHref: null,
  read: false,
  archived: false,
  createdAt: new Date(),
};

const mockService = {
  findAll: jest.fn(),
  unreadCount: jest.fn(),
  markRead: jest.fn(),
  markAllRead: jest.fn(),
  archive: jest.fn(),
};

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: mockService }],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('delegates to service with userId and filters', async () => {
      const page = {
        data: [mockNotification],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };
      mockService.findAll.mockResolvedValue(page);

      const result = await controller.findAll('user-1', {});

      expect(mockService.findAll).toHaveBeenCalledWith('user-1', {});
      expect(result.data).toHaveLength(1);
    });
  });

  describe('unreadCount', () => {
    it('returns { count } object', async () => {
      mockService.unreadCount.mockResolvedValue(3);

      const result = await controller.unreadCount('user-1');

      expect(result).toEqual({ count: 3 });
    });
  });

  describe('markRead', () => {
    it('delegates to service', async () => {
      mockService.markRead.mockResolvedValue({
        ...mockNotification,
        read: true,
      });

      const result = await controller.markRead('notif-1', 'user-1');

      expect(mockService.markRead).toHaveBeenCalledWith('notif-1', 'user-1');
      expect(result.read).toBe(true);
    });
  });

  describe('markAllRead', () => {
    it('returns { updated } count', async () => {
      mockService.markAllRead.mockResolvedValue(5);

      const result = await controller.markAllRead('user-1');

      expect(result).toEqual({ updated: 5 });
    });
  });

  describe('archive', () => {
    it('delegates to service', async () => {
      mockService.archive.mockResolvedValue({
        ...mockNotification,
        archived: true,
      });

      const result = await controller.archive('notif-1', 'user-1');

      expect(mockService.archive).toHaveBeenCalledWith('notif-1', 'user-1');
      expect(result.archived).toBe(true);
    });
  });
});
