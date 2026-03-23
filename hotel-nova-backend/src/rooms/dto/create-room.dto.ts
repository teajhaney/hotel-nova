import { RoomStatus, RoomType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 109,
    description:
      'Room number — combined with type to generate the unique roomRef (e.g. 109 + Deluxe → RN-109-DX)',
  })
  @IsInt()
  @Min(1)
  roomNumber: number;

  @ApiProperty({ example: 'Ocean View Deluxe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ enum: RoomType })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({
    example: 175000,
    description: 'Price per night in the smallest currency unit (e.g. kobo)',
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ enum: RoomStatus, default: RoomStatus.Available })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiPropertyOptional({
    example: 'A spacious room with breathtaking ocean views.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '1 King Bed' })
  @IsOptional()
  @IsString()
  beds?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxGuests?: number;

  @ApiPropertyOptional({
    example: 42,
    description: 'Room size in square metres',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  sqm?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['WiFi', 'Air Conditioning', 'Mini Bar'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
