import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, RoomStatus, RoomType } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFiltersDto } from './dto/room-filters.dto';
import { RoomsService } from './rooms.service';

const mockRoom = {
  id: 'room-1',
  roomNumber: 109,
  roomRef: 'RN-109-DX',
  name: 'Ocean View Deluxe',
  type: RoomType.Deluxe,
  price: 175000,
  status: RoomStatus.Available,
  description: null,
  imageUrl: null,
  imagePublicId: null,
  beds: '1 King Bed',
  maxGuests: 2,
  sqm: 42,
  amenities: ['WiFi', 'Air Conditioning'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  room: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

const mockCloudinary = {
  uploadStream: jest.fn(),
  destroy: jest.fn(),
};

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CloudinaryService, useValue: mockCloudinary },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    jest.clearAllMocks();
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns paginated rooms with meta', async () => {
      mockPrisma.room.count.mockResolvedValue(1);
      mockPrisma.room.findMany.mockResolvedValue([mockRoom]);

      const filters: RoomFiltersDto = { page: 1, limit: 20 };
      const result = await service.findAll(filters);

      expect(result.data).toEqual([mockRoom]);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('applies type and status filters to the query', async () => {
      mockPrisma.room.count.mockResolvedValue(0);
      mockPrisma.room.findMany.mockResolvedValue([]);

      const filters: RoomFiltersDto = {
        type: RoomType.Suite,
        status: RoomStatus.Available,
      };
      await service.findAll(filters);

      const [countCall] = mockPrisma.room.count.mock.calls as [
        [{ where: Prisma.RoomWhereInput }],
      ];
      expect(countCall[0].where.type).toBe(RoomType.Suite);
      expect(countCall[0].where.status).toBe(RoomStatus.Available);
    });

    it('applies price range filter when minPrice and maxPrice are provided', async () => {
      mockPrisma.room.count.mockResolvedValue(0);
      mockPrisma.room.findMany.mockResolvedValue([]);

      await service.findAll({ minPrice: 10000, maxPrice: 50000 });

      const [countCall] = mockPrisma.room.count.mock.calls as [
        [{ where: Prisma.RoomWhereInput }],
      ];
      expect(countCall[0].where.price).toEqual({ gte: 10000, lte: 50000 });
    });

    it('caps limit at 100 even if caller passes a higher value', async () => {
      mockPrisma.room.count.mockResolvedValue(0);
      mockPrisma.room.findMany.mockResolvedValue([]);

      await service.findAll({ limit: 999 });

      const [findCall] = mockPrisma.room.findMany.mock.calls as [
        [{ take: number }],
      ];
      expect(findCall[0].take).toBe(100);
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the room when found', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);

      const result = await service.findOne('room-1');

      expect(result).toEqual(mockRoom);
    });

    it('throws NotFoundException when room does not exist', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto: CreateRoomDto = {
      roomNumber: 109,
      name: 'Ocean View Deluxe',
      type: RoomType.Deluxe,
      price: 175000,
    };

    it('generates the correct roomRef and creates the room', async () => {
      mockPrisma.room.create.mockResolvedValue(mockRoom);

      const result = await service.create(dto);

      // service should have composed RN-109-DX before writing to DB
      const [createCall] = mockPrisma.room.create.mock.calls as [
        [{ data: { roomRef: string } }],
      ];
      expect(createCall[0].data.roomRef).toBe('RN-109-DX');
      expect(result).toEqual(mockRoom);
    });

    it('pads room numbers below 100 to three digits', async () => {
      mockPrisma.room.create.mockResolvedValue(mockRoom);

      await service.create({ ...dto, roomNumber: 5 });

      const [createCall] = mockPrisma.room.create.mock.calls as [
        [{ data: { roomRef: string } }],
      ];
      expect(createCall[0].data.roomRef).toBe('RN-005-DX');
    });

    it('throws ConflictException when the room number + type combo is taken (P2002)', async () => {
      const p2002 = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint',
        { code: 'P2002', clientVersion: '0' },
      );
      mockPrisma.room.create.mockRejectedValue(p2002);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('re-throws non-P2002 errors as-is', async () => {
      mockPrisma.room.create.mockRejectedValue(new Error('DB offline'));

      await expect(service.create(dto)).rejects.toThrow('DB offline');
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('returns the updated room', async () => {
      mockPrisma.room.update.mockResolvedValue({
        ...mockRoom,
        name: 'Renovated Suite',
      });

      const result = await service.update('room-1', {
        name: 'Renovated Suite',
      });

      expect(result.name).toBe('Renovated Suite');
    });

    it('regenerates roomRef when roomNumber changes', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);
      mockPrisma.room.update.mockResolvedValue({
        ...mockRoom,
        roomNumber: 201,
        roomRef: 'RN-201-DX',
      });

      await service.update('room-1', { roomNumber: 201 });

      const [updateCall] = mockPrisma.room.update.mock.calls as [
        [{ data: { roomRef: string } }],
      ];
      expect(updateCall[0].data.roomRef).toBe('RN-201-DX');
    });

    it('regenerates roomRef when type changes', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);
      mockPrisma.room.update.mockResolvedValue({
        ...mockRoom,
        type: RoomType.Suite,
        roomRef: 'RN-109-SU',
      });

      await service.update('room-1', { type: RoomType.Suite });

      const [updateCall] = mockPrisma.room.update.mock.calls as [
        [{ data: { roomRef: string } }],
      ];
      expect(updateCall[0].data.roomRef).toBe('RN-109-SU');
    });

    it('throws NotFoundException when room does not exist (P2025)', async () => {
      const p2025 = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '0',
      });
      mockPrisma.room.update.mockRejectedValue(p2025);

      await expect(service.update('bad-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when updated combo already exists (P2002)', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);
      const p2002 = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint',
        { code: 'P2002', clientVersion: '0' },
      );
      mockPrisma.room.update.mockRejectedValue(p2002);

      await expect(
        service.update('room-1', { roomNumber: 201 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the room and skips Cloudinary when no image is set', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom); // imagePublicId: null
      mockPrisma.room.delete.mockResolvedValue(mockRoom);

      await expect(service.remove('room-1')).resolves.toBeUndefined();
      expect(mockCloudinary.destroy).not.toHaveBeenCalled();
      expect(mockPrisma.room.delete).toHaveBeenCalledWith({
        where: { id: 'room-1' },
      });
    });

    it('deletes the Cloudinary image before removing the DB row', async () => {
      const roomWithImage = {
        ...mockRoom,
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/room.jpg',
        imagePublicId: 'hotel-nova/rooms/room',
      };
      mockPrisma.room.findUnique.mockResolvedValue(roomWithImage);
      mockCloudinary.destroy.mockResolvedValue(undefined);
      mockPrisma.room.delete.mockResolvedValue(roomWithImage);

      await expect(service.remove('room-1')).resolves.toBeUndefined();
      expect(mockCloudinary.destroy).toHaveBeenCalledWith(
        'hotel-nova/rooms/room',
      );
      expect(mockPrisma.room.delete).toHaveBeenCalledWith({
        where: { id: 'room-1' },
      });
    });

    it('throws NotFoundException when room does not exist', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
      expect(mockPrisma.room.delete).not.toHaveBeenCalled();
    });
  });

  // ─── uploadPhoto ───────────────────────────────────────────────────────────

  describe('uploadPhoto', () => {
    const mockFile = {
      buffer: Buffer.from('fake-image'),
      originalname: 'room.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    it('uploads to cloudinary and saves both imageUrl and imagePublicId', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);
      mockCloudinary.uploadStream.mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/room.jpg',
        public_id: 'hotel-nova/rooms/room',
      });
      mockPrisma.room.update.mockResolvedValue({
        ...mockRoom,
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/room.jpg',
        imagePublicId: 'hotel-nova/rooms/room',
      });

      const result = await service.uploadPhoto('room-1', mockFile);

      expect(mockCloudinary.uploadStream).toHaveBeenCalledWith(
        mockFile.buffer,
        'hotel-nova/rooms',
      );
      const [updateCall] = mockPrisma.room.update.mock.calls as [
        [{ data: { imageUrl: string; imagePublicId: string } }],
      ];
      expect(updateCall[0].data.imagePublicId).toBe('hotel-nova/rooms/room');
      expect(result.imageUrl).toBe(
        'https://res.cloudinary.com/demo/image/upload/room.jpg',
      );
    });

    it('throws NotFoundException if room does not exist', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(null);

      await expect(service.uploadPhoto('bad-id', mockFile)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCloudinary.uploadStream).not.toHaveBeenCalled();
    });
  });
});
