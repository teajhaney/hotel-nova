import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

// All fields from CreateRoomDto become optional.
// If roomNumber or type is sent, the service regenerates roomRef automatically.
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
