import { ReviewStatus, RoomType } from '@prisma/client';

export interface EligibleBooking {
  bookingId: string;
  bookingRef: string;
  roomId: string;
  roomName: string;
  roomType: RoomType;
  imageUrl: string | null;
  checkIn: Date;
  checkOut: Date;
  updatedAt: Date;
  review: {
    id: string;
    rating: number;
    reviewText: string;
    status: ReviewStatus;
    submittedAt: Date;
  } | null;
}

export interface ReviewWithRelations {
  id: string;
  rating: number;
  reviewText: string;
  status: ReviewStatus;
  submittedAt: Date;
  updatedAt: Date;
  guest: {
    id: string;
    fullName: string;
    email: string;
  };
  room: {
    id: string;
    name: string;
    type: RoomType;
  };
  booking: {
    id: string;
    bookingRef: string;
  };
}

export interface ReviewsPage {
  data: ReviewWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
