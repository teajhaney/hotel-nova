import { RoomType } from '@prisma/client';

// Maps each RoomType to its two-letter abbreviation used in roomRef.
// Keeping this as a const object means adding a new type only requires one line here.
export const ROOM_TYPE_ABBR: Record<RoomType, string> = {
  [RoomType.Standard]: 'SD',
  [RoomType.Deluxe]: 'DX',
  [RoomType.Executive]: 'EX',
  [RoomType.Suite]: 'SU',
};

// Builds the human-readable room reference from a number and type.
// Room 5, Deluxe  → RN-005-DX
// Room 109, Suite → RN-109-SU
export function buildRoomRef(roomNumber: number, type: RoomType): string {
  const abbr = ROOM_TYPE_ABBR[type];
  const padded = String(roomNumber).padStart(3, '0');
  return `RN-${padded}-${abbr}`;
}
