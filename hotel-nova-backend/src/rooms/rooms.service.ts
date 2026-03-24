import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ROOMS_MESSAGES } from '../common/constants/messages';
import { buildRoomRef } from './helpers/room.helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFiltersDto } from './dto/room-filters.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

export interface RoomsPage {
  data: Room[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  // GET ALL ROOMS
  async findAll(filters: RoomFiltersDto): Promise<RoomsPage> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.RoomWhereInput = {};
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.room.count({ where }),
      this.prisma.room.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { roomNumber: 'asc' }],
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // GET ROOM BY ID
  async findOne(id: string): Promise<Room> {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException(ROOMS_MESSAGES.ROOM_NOT_FOUND);
    return room;
  }

  // CREATE ROOM
  // roomRef is generated here — the admin never types it.
  // The @@unique([roomNumber, type]) constraint on the DB catches duplicates.
  // P2002 fires when either the generated roomRef or the [roomNumber, type]
  // combination already exists — both map to the same "this combo is taken" error.
  async create(dto: CreateRoomDto): Promise<Room> {
    const roomRef = buildRoomRef(dto.roomNumber, dto.type);
    try {
      return await this.prisma.room.create({
        data: { ...dto, roomRef, amenities: dto.amenities ?? [] },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(ROOMS_MESSAGES.ROOM_NUMBER_TYPE_IN_USE);
      }
      throw err;
    }
  }

  // UPDATE ROOM
  // If roomNumber or type changes, we regenerate roomRef so it stays in sync.
  // We resolve roomRef first with explicit types to keep ESLint happy, then
  // build the final payload in one shot — no mutating `data` mid-function.
  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    try {
      let roomRef: string | undefined;

      if (dto.roomNumber !== undefined || dto.type !== undefined) {
        const current = await this.findOne(id);
        const newNumber =
          dto.roomNumber !== undefined ? dto.roomNumber : current.roomNumber;
        const newType = dto.type !== undefined ? dto.type : current.type;
        roomRef = buildRoomRef(newNumber, newType);
      }

      return await this.prisma.room.update({
        where: { id },
        data: {
          ...(dto as Prisma.RoomUpdateInput),
          ...(roomRef !== undefined && { roomRef }),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new NotFoundException(ROOMS_MESSAGES.ROOM_NOT_FOUND);
        if (err.code === 'P2002')
          throw new ConflictException(ROOMS_MESSAGES.ROOM_NUMBER_TYPE_IN_USE);
      }
      throw err;
    }
  }

  // DELETE ROOM
  // We fetch the room first so we can grab its imagePublicId before the row
  // is gone. If a Cloudinary image exists we delete it, then delete the DB row.
  // Cloudinary failure is non-fatal — the room is still removed from the DB.
  async remove(id: string): Promise<void> {
    const room = await this.findOne(id); // throws NotFoundException if missing

    const publicId = room.imagePublicId;
    if (typeof publicId === 'string') {
      await this.cloudinary.destroy(publicId);
    }

    await this.prisma.room.delete({ where: { id } });
  }

  // UPLOAD ROOM PHOTO
  // We save both the public URL (imageUrl) and the Cloudinary asset ID
  // (imagePublicId) so the delete flow can clean up the asset later.
  async uploadPhoto(id: string, file: Express.Multer.File): Promise<Room> {
    await this.findOne(id);

    const { secure_url, public_id } = await this.cloudinary.uploadStream(
      file.buffer,
      'hotel-nova/rooms',
    );

    return this.prisma.room.update({
      where: { id },
      data: { imageUrl: secure_url, imagePublicId: public_id },
    });
  }
}
