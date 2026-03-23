'use client';

import { create } from 'zustand';
import type { User } from '@/type/api';

// The auth store holds just enough to know who is logged in and what they can
// do. We intentionally do NOT store the JWT here — that lives in an HttpOnly
// cookie managed by the server.
interface AuthStore {
  user: User | null;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user, isHydrated: true }),
  clearUser: () => set({ user: null, isHydrated: true }),
  setHydrated: (value) => set({ isHydrated: value }),
}));
