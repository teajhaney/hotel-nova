import { applyDecorators } from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

// Swagger metadata lives here so the controller stays focused on routing.
// applyDecorators lets us compose multiple decorators into one named function —
// clean to read at the call site and easy to extend without touching the controller.

export const ApiGetRooms = () =>
  applyDecorators(
    ApiOperation({
      summary: 'List all rooms with optional filters and pagination',
    }),
  );

export const ApiGetRoom = () =>
  applyDecorators(ApiOperation({ summary: 'Get a single room by its ID' }));

export const ApiCreateRoom = () =>
  applyDecorators(ApiOperation({ summary: 'Create a new room (admin only)' }));

export const ApiUpdateRoom = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update room details (admin only)' }),
  );

export const ApiDeleteRoom = () =>
  applyDecorators(ApiOperation({ summary: 'Delete a room (admin only)' }));

export const ApiUploadRoomPhoto = () =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiOperation({ summary: 'Upload or replace a room photo (admin only)' }),
  );
