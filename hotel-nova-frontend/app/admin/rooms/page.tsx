'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { AnimatePresence } from 'motion/react';
import { isAxiosError } from 'axios';
import { RoomFormModal } from '@/components/admin/rooms/RoomFormModal';
import { DeleteRoomModal } from '@/components/admin/rooms/DeleteRoomModal';
import { useRooms, useDeleteRoom } from '@/hooks/use-rooms';
import { RoomData } from '@/type/interface';
import type { Room, RoomFilters } from '@/type/api';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';

const M = ADMIN_DASHBOARD_MESSAGES;

const STATUS_DOT: Record<string, string> = {
  Available: 'bg-[#10B981]',
  Occupied: 'bg-[#1D4ED8]',
  Maintenance: 'bg-[#F59E0B]',
};

const STATUS_TEXT: Record<string, string> = {
  Available: 'text-[#10B981]',
  Occupied: 'text-[#1D4ED8]',
  Maintenance: 'text-[#F59E0B]',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=128&h=128&fit=crop&auto=format';

// Maps a backend Room to the RoomData shape the form modal expects
function toFormData(room: Room): RoomData {
  return {
    id: room.id,
    roomNumber: room.roomNumber,
    name: room.name,
    type: room.type,
    price: room.price,
    status: room.status,
    image: room.imageUrl ?? FALLBACK_IMAGE,
    description: room.description ?? '',
    beds: room.beds ?? '',
    maxGuests: room.maxGuests,
    sqm: room.sqm ?? undefined,
    amenities: room.amenities,
  };
}

export default function AdminRoomsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(M.allTypes);
  const [statusFilter, setStatusFilter] = useState<string>(M.allStatuses);
  const [page, setPage] = useState(1);

  // Build the filters object that gets passed to the query
  const filters: RoomFilters = {
    page,
    limit: 20,
    ...(typeFilter !== M.allTypes && { type: typeFilter as Room['type'] }),
    ...(statusFilter !== M.allStatuses && {
      status: statusFilter as Room['status'],
    }),
  };

  const { data, isLoading, isError } = useRooms(filters);
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();

  const rooms = data?.data ?? [];
  const meta = data?.meta;

  // Client-side search filter on top of the server-side type/status filters
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = rooms.filter((r) => {
    if (!normalizedSearch) return true;
    return (
      r.name.toLowerCase().includes(normalizedSearch) ||
      String(r.roomNumber).includes(normalizedSearch) ||
      (r.description ?? '').toLowerCase().includes(normalizedSearch)
    );
  });

  // Modal state
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  const handleOpenAdd = () => {
    setSelectedRoom(null);
    setModalMode('add');
  };

  const handleOpenEdit = (room: Room) => {
    setSelectedRoom(toFormData(room));
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedRoom(null);
  };

  // After create/update succeeds the modal calls this — we just close it.
  // TanStack Query handles the cache invalidation and re-fetch automatically.
  const handleSave = () => handleCloseModal();

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteRoom(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => {
        const msg = isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message
          : undefined;
        alert(msg ?? 'Failed to delete room. Please try again.');
      },
    });
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.roomsTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            {meta ? `${meta.total} rooms in inventory` : 'Loading...'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors self-start sm:self-auto shrink-0 whitespace-nowrap"
        >
          <Plus size={16} />
          {M.addNewRoom}
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 sm:flex-1 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white">
          <Search size={15} className="text-[#94A3B8] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={M.searchRoomsPlaceholder}
            className="flex-1 text-[14px] w-full bg-transparent border-none outline-none text-[#0D0F2B] placeholder:text-[#94A3B8]"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="h-10 pl-3 pr-8 w-full rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
            >
              <option>{M.allTypes}</option>
              <option>{M.typeDeluxe}</option>
              <option>{M.typeSuite}</option>
              <option>{M.typeStandard}</option>
              <option>{M.typeExecutive}</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
          </div>
          <div className="relative flex-1 sm:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 pl-3 pr-8 w-full rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
            >
              <option>{M.allStatuses}</option>
              <option>{M.statusAvailable}</option>
              <option>{M.statusOccupied}</option>
              <option>{M.statusMaintenance}</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">{M.roomsColRoomInfo}</th>
                <th className="admin-table-th">{M.roomsColType}</th>
                <th className="admin-table-th">{M.roomsColPricePerNight}</th>
                <th className="admin-table-th">{M.roomsColStatus}</th>
                <th className="admin-table-th">{M.roomsColActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[#E2E8F0] last:border-0">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-[#E2E8F0] shrink-0"></div>
                        <div>
                          <div className="h-4 bg-[#E2E8F0] rounded w-32 mb-1.5"></div>
                          <div className="h-3 bg-[#E2E8F0] rounded w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-td"><div className="h-4 bg-[#E2E8F0] rounded w-24"></div></td>
                    <td className="admin-table-td"><div className="h-4 bg-[#E2E8F0] rounded w-20"></div></td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#E2E8F0]"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded w-16"></div>
                      </div>
                    </td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#E2E8F0]"></div>
                        <div className="w-8 h-8 rounded-lg bg-[#E2E8F0]"></div>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {isError && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[14px] text-[#EF4444]">
                    Failed to load rooms. Please refresh the page.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filtered.map((room) => (
                <tr key={room.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="admin-table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 relative">
                        <Image
                          src={room.imageUrl ?? FALLBACK_IMAGE}
                          alt={room.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#0D0F2B]">
                          {room.name}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">
                          {room.roomRef}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-td text-[13px] text-[#64748B]">
                    {room.type}
                  </td>
                  <td className="admin-table-td text-[13px] font-medium text-[#0D0F2B]">
                    {formatNgn(room.price)}
                  </td>
                  <td className="admin-table-td">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[room.status]}`} />
                      <span className={`text-[13px] font-medium ${STATUS_TEXT[room.status]}`}>
                        {room.status}
                      </span>
                    </div>
                  </td>
                  <td className="admin-table-td">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                        aria-label={M.editRoomAriaLabel}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(room)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                        aria-label={M.deleteRoomAriaLabel}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    {M.noRoomsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <p className="text-[13px] text-[#64748B]">
              Showing {filtered.length} of {meta.total} rooms
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                    p === page
                      ? 'bg-[#020887] text-white'
                      : 'text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalMode && (
          <RoomFormModal
            key="room-form"
            room={selectedRoom}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteRoomModal
            key="delete-room"
            roomName={deleteTarget.name}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
