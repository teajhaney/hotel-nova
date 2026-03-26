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

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface EligibleBooking {
  bookingId: string;
  bookingRef: string;
  roomId: string;
  roomName: string;
  roomType: 'Standard' | 'Deluxe' | 'Executive' | 'Suite';
  imageUrl: string | null;
  checkIn: string;
  checkOut: string;
  review: {
    id: string;
    rating: number;
    reviewText: string;
    status: 'Pending' | 'Approved' | 'Hidden';
    submittedAt: string;
  } | null;
}

export interface ReviewWithRelations {
  id: string;
  rating: number;
  reviewText: string;
  status: 'Pending' | 'Approved' | 'Hidden';
  submittedAt: string;
  updatedAt: string;
  guest: { id: string; fullName: string; email: string };
  room: { id: string; name: string; type: string };
  booking: { id: string; bookingRef: string };
}

export interface ReviewsPage {
  data: ReviewWithRelations[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── Promo Codes ──────────────────────────────────────────────────────────────

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit: number;
  used: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Inactive' | 'Scheduled';
  createdAt: string;
  updatedAt: string;
}

export interface PromoCodesPage {
  data: PromoCode[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'booking_confirmed'
  | 'checkout_reminder'
  | 'payment_received'
  | 'review_prompt'
  | 'new_booking'
  | 'new_user_registered'
  | 'new_review_submitted'
  | 'room_status_changed'
  | 'security_alert'
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  bookingId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  actionLabel: string | null;
  actionHref: string | null;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export interface NotificationsPage {
  data: Notification[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface OccupancyPoint { day: string; value: number }
export interface RevenuePoint { month: string; value: number }
export interface UpcomingCheckIn {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  status: string;
}

export interface OverviewStats {
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  dailyRevenue: number;
  occupancyTrend: OccupancyPoint[];
  monthlyRevenue: RevenuePoint[];
  upcomingCheckIns: UpcomingCheckIn[];
}

export interface WeeklyOccupancyPoint { label: string; value: number }
export interface MonthlyRevenuePoint { month: string; current: number }
export interface HighValueBooking {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: string;
}

export interface AnalyticsSummary {
  totalOccupancy: number;
  averageRevenue: number;
  activeBookings: number;
  guestSatisfaction: number;
  occupancyTrends: WeeklyOccupancyPoint[];
  monthlyRevenue: MonthlyRevenuePoint[];
  highValueBookings: HighValueBooking[];
}
