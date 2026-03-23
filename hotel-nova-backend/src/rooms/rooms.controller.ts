import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Admin } from '../auth/decorators/admin.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFiltersDto } from './dto/room-filters.dto';
import {
  ApiCreateRoom,
  ApiDeleteRoom,
  ApiGetRoom,
  ApiGetRooms,
  ApiUpdateRoom,
  ApiUploadRoomPhoto,
} from './rooms.swagger';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

// 5 MB ceiling — large enough for a high-quality room photo,
// small enough to keep uploads fast on slow connections.
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  // GET ALL ROOMS
  @Public()
  @Get()
  @ApiGetRooms()
  findAll(@Query() filters: RoomFiltersDto) {
    return this.roomsService.findAll(filters);
  }

  // GET ROOM BY ID
  @Public()
  @Get(':id')
  @ApiGetRoom()
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  // CREATE ROOM
  @Admin()
  @Post()
  @ApiCreateRoom()
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  // UPDATE ROOM
  @Admin()
  @Patch(':id')
  @ApiUpdateRoom()
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  // DELETE ROOM
  @Admin()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteRoom()
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  // UPLOAD ROOM PHOTO
  // FileInterceptor('file') tells Multer to look for a field named "file" in
  // the multipart/form-data request body.
  // ParseFilePipe runs before the handler — it rejects the request immediately
  // if the file is too large or not an accepted image type, so the service never
  // even sees a bad upload.
  @Admin()
  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadRoomPhoto()
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_PHOTO_SIZE }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.roomsService.uploadPhoto(id, file);
  }
}
