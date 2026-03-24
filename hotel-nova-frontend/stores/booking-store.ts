'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BookingRoom, GuestDetails } from '@/type/type';

interface BookingStore {
  // Step 1 state — room is always pre-selected from the rooms page
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  rooms: number;
  selectedRoom: BookingRoom | null;
  // Step 2 state — promo code (no guest details form; Paystack collects that)
  guestDetails: GuestDetails | null;
  promoCode: string;
  promoDiscount: number;
  specialRequests: string;
  // Post-creation state (set after the backend creates the booking)
  confirmationId: string | null;
  bookingId: string | null;
  bookingRef: string | null;

  // Actions
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (adults: number, children: number, rooms: number) => void;
  selectRoom: (room: BookingRoom) => void;
  setGuestDetails: (details: GuestDetails) => void;
  applyPromo: (code: string, discount: number) => void;
  setSpecialRequests: (requests: string) => void;
  setConfirmationId: (id: string) => void;
  setBookingCreated: (bookingId: string, bookingRef: string) => void;
  reset: () => void;

  // Computed helpers (not persisted — call as functions)
  getNights: () => number;
  getSubtotal: () => number;
  getServiceCharge: () => number;
  getVat: () => number;
  getTotal: () => number;
}

const initialState = {
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  rooms: 1,
  selectedRoom: null,
  guestDetails: null,
  promoCode: '',
  promoDiscount: 0,
  specialRequests: '',
  confirmationId: null,
  bookingId: null,
  bookingRef: null,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (adults, children, rooms) => set({ adults, children, rooms }),
      selectRoom: (room) => set({ selectedRoom: room }),
      setGuestDetails: (details) => set({ guestDetails: details }),
      applyPromo: (code, discount) => set({ promoCode: code, promoDiscount: discount }),
      setSpecialRequests: (requests) => set({ specialRequests: requests }),
      setConfirmationId: (id) => set({ confirmationId: id }),
      setBookingCreated: (bookingId, bookingRef) => set({ bookingId, bookingRef }),
      reset: () => set(initialState),

      getNights: () => {
        const { checkIn, checkOut } = get();
        if (!checkIn || !checkOut) return 0;
        const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
        return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
      },
      getSubtotal: () => {
        const { selectedRoom } = get();
        if (!selectedRoom) return 0;
        return selectedRoom.price * get().getNights();
      },
      getServiceCharge: () => Math.round(get().getSubtotal() * 0.05),
      getVat: () => Math.round(get().getSubtotal() * 0.075),
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const service = get().getServiceCharge();
        const vat = get().getVat();
        const { promoDiscount } = get();
        return subtotal + service + vat - promoDiscount;
      },
    }),
    {
      name: 'hotel-nova-booking',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
    }
  )
);
