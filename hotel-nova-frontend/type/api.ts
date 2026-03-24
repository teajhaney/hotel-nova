// Types that mirror the NestJS backend responses exactly.
// Keep these in sync with the Prisma models on the backend.

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'GUEST' | 'ADMIN';
  // Fields returned by GET /auth/me (getMe selects these from the DB)
  phone: string | null;
  country: string | null;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
}

// Login and signup return { message, user }. Tokens are HttpOnly cookies —
// they are never sent in the response body, so accessToken is not here.
export interface AuthResponse {
  message: string;
  user: User;
}

export interface Room {
  id: string;
  roomNumber: number;
  roomRef: string;
  name: string;
  type: 'Standard' | 'Deluxe' | 'Executive' | 'Suite';
  price: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  beds: string | null;
  maxGuests: number;
  sqm: number | null;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoomsPage {
  data: Room[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RoomFilters {
  type?: Room['type'];
  status?: Room['status'];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CreateRoomPayload {
  roomNumber: number;
  name: string;
  type: Room['type'];
  price: number;
  status?: Room['status'];
  description?: string;
  beds?: string;
  maxGuests?: number;
  sqm?: number;
  amenities?: string[];
}

export type UpdateRoomPayload = Partial<CreateRoomPayload>;
