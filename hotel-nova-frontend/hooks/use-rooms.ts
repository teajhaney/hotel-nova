'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type {
  Room,
  RoomsPage,
  RoomFilters,
  CreateRoomPayload,
  UpdateRoomPayload,
} from '@/type/api';

// TanStack Query uses query keys to cache and invalidate data.
// We keep them in one place so every hook references the same keys.
const ROOMS_KEY = {
  all: ['rooms'] as const,
  list: (filters: RoomFilters) => ['rooms', 'list', filters] as const,
  detail: (id: string) => ['rooms', id] as const,
};

// ─── useRooms ─────────────────────────────────────────────────────────────────
// Fetches a paginated, filtered list of rooms.
export function useRooms(filters: RoomFilters = {}) {
  return useQuery({
    queryKey: ROOMS_KEY.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.minPrice !== undefined)
        params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined)
        params.set('maxPrice', String(filters.maxPrice));
      if (filters.page !== undefined)
        params.set('page', String(filters.page));
      if (filters.limit !== undefined)
        params.set('limit', String(filters.limit));

      const { data } = await apiClient.get<RoomsPage>(
        `/rooms?${params.toString()}`,
      );
      return data;
    },
  });
}

// ─── useRoom ──────────────────────────────────────────────────────────────────
// Fetches a single room by its ID.
export function useRoom(id: string) {
  return useQuery({
    queryKey: ROOMS_KEY.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Room>(`/rooms/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── useCreateRoom ────────────────────────────────────────────────────────────
// Creates a new room. On success, refreshes the room list automatically.
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoomPayload) => {
      const { data } = await apiClient.post<Room>('/rooms', payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate all room list queries so the new room shows up immediately
      void queryClient.invalidateQueries({ queryKey: ROOMS_KEY.all });
    },
  });
}

// ─── useUpdateRoom ────────────────────────────────────────────────────────────
// Updates an existing room. Refreshes both the list and the single-room cache.
export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRoomPayload;
    }) => {
      const { data } = await apiClient.patch<Room>(`/rooms/${id}`, payload);
      return data;
    },
    onSuccess: (updatedRoom) => {
      void queryClient.invalidateQueries({ queryKey: ROOMS_KEY.all });
      // Also update the individual room cache in place
      queryClient.setQueryData(ROOMS_KEY.detail(updatedRoom.id), updatedRoom);
    },
  });
}

// ─── useDeleteRoom ────────────────────────────────────────────────────────────
// Deletes a room. Cloudinary cleanup is handled on the backend automatically.
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROOMS_KEY.all });
    },
  });
}

// ─── useUploadRoomPhoto ───────────────────────────────────────────────────────
// Uploads a photo for a room. Sends multipart/form-data.
export function useUploadRoomPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await apiClient.post<Room>(
        `/rooms/${id}/photos`,
        formData,
        // Let the browser set the Content-Type with the correct boundary
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
    onSuccess: (updatedRoom) => {
      void queryClient.invalidateQueries({ queryKey: ROOMS_KEY.all });
      queryClient.setQueryData(ROOMS_KEY.detail(updatedRoom.id), updatedRoom);
    },
  });
}
