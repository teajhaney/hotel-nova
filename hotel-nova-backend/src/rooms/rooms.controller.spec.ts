import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomStatus, RoomType } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFiltersDto } from './dto/room-filters.dto';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

const mockRoom = {
  id: 'room-1',
  roomNumber: 109,
  roomRef: 'RN-109-DX',
  name: 'Ocean View Deluxe',
  type: RoomType.Deluxe,
  price: 45000,
  status: RoomStatus.Available,
  description: null,
  imageUrl: null,
  beds: '2 King Beds',
  maxGuests: 2,
  sqm: 42,
  amenities: ['WiFi'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPage = {
  data: [mockRoom],
  meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
};

const mockRoomsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  uploadPhoto: jest.fn(),
};

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{ provide: RoomsService, useValue: mockRoomsService }],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    jest.clearAllMocks();
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('delegates to service and returns paginated rooms', async () => {
      const filters: RoomFiltersDto = { page: 1, limit: 20 };
      mockRoomsService.findAll.mockResolvedValue(mockPage);

      const result = await controller.findAll(filters);

      expect(mockRoomsService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPage);
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the room for a valid id', async () => {
      mockRoomsService.findOne.mockResolvedValue(mockRoom);

      const result = await controller.findOne('room-1');

      expect(mockRoomsService.findOne).toHaveBeenCalledWith('room-1');
      expect(result).toEqual(mockRoom);
    });

    it('bubbles up NotFoundException from the service', async () => {
      mockRoomsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('passes dto to service and returns the created room', async () => {
      const dto: CreateRoomDto = {
        roomNumber: 109,
        name: 'Ocean View Deluxe',
        type: RoomType.Deluxe,
        price: 175000,
      };
      mockRoomsService.create.mockResolvedValue(mockRoom);

      const result = await controller.create(dto);

      expect(mockRoomsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockRoom);
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('passes id and dto to service and returns updated room', async () => {
      const updated = { ...mockRoom, name: 'Mountain Suite' };
      mockRoomsService.update.mockResolvedValue(updated);

      const result = await controller.update('room-1', {
        name: 'Mountain Suite',
      });

      expect(mockRoomsService.update).toHaveBeenCalledWith('room-1', {
        name: 'Mountain Suite',
      });
      expect(result.name).toBe('Mountain Suite');
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('calls service.remove with the room id', async () => {
      mockRoomsService.remove.mockResolvedValue(undefined);

      await controller.remove('room-1');

      expect(mockRoomsService.remove).toHaveBeenCalledWith('room-1');
    });
  });

  // ─── uploadPhoto ───────────────────────────────────────────────────────────

  describe('uploadPhoto', () => {
    const mockFile = {
      buffer: Buffer.from('fake-image'),
      originalname: 'room.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    it('calls service.uploadPhoto and returns the updated room', async () => {
      const withPhoto = {
        ...mockRoom,
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/room.jpg',
      };
      mockRoomsService.uploadPhoto.mockResolvedValue(withPhoto);

      const result = await controller.uploadPhoto('room-1', mockFile);

      expect(mockRoomsService.uploadPhoto).toHaveBeenCalledWith(
        'room-1',
        mockFile,
      );
      expect(result.imageUrl).toBe(
        'https://res.cloudinary.com/demo/image/upload/room.jpg',
      );
    });
  });
});
