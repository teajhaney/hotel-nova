'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { RoomFormModal, } from '@/components/admin/rooms/RoomFormModal';
import { DeleteRoomModal } from '@/components/admin/rooms/DeleteRoomModal';
import { INITIAL_ROOMS } from '@/constants/dummyData';
import { RoomData } from '@/type/interface';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

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

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomData[]>(INITIAL_ROOMS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(M.allTypes);
  const [statusFilter, setStatusFilter] = useState<string>(M.allStatuses);

  // Modal state
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomData | null>(null);

  const filtered = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === M.allTypes || r.type === typeFilter;
    const matchStatus = statusFilter === M.allStatuses || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleOpenAdd = () => {
    setSelectedRoom(null);
    setModalMode('add');
  };

  const handleOpenEdit = (room: RoomData) => {
    setSelectedRoom(room);
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedRoom(null);
  };

  const handleSave = (data: RoomData) => {
    if (modalMode === 'add') {
      setRooms((prev) => [data, ...prev]);
    } else {
      setRooms((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    }
    handleCloseModal();
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.roomsTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            {rooms.length} rooms in inventory
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors"
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
            onChange={e => setSearch(e.target.value)}
            placeholder={M.searchRoomsPlaceholder}
            className="flex-1 text-[14px] bg-transparent border-none outline-none text-[#0D0F2B] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>{M.allTypes}</option>
            <option>{M.typeDeluxe}</option>
            <option>{M.typeSuite}</option>
            <option>{M.typeStandard}</option>
            <option>{M.typeExecutive}</option>
          </select>
          <ChevronDown
            size={14}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>{M.allStatuses}</option>
            <option>{M.statusAvailable}</option>
            <option>{M.statusOccupied}</option>
            <option>{M.statusMaintenance}</option>
          </select>
          <ChevronDown
            size={14}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
              {filtered.map(room => (
                <tr
                  key={room.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="admin-table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 relative">
                        <Image
                          src={room.image}
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
                          {room.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-td text-[13px] text-[#64748B]">
                    {room.type}
                  </td>
                  <td className="admin-table-td text-[13px] font-medium text-[#0D0F2B]">
                    ₦{room.price.toLocaleString()}
                  </td>
                  <td className="admin-table-td">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[room.status]}`}
                      />
                      <span
                        className={`text-[13px] font-medium ${STATUS_TEXT[room.status]}`}
                      >
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-[14px] text-[#94A3B8]"
                  >
                    {M.noRoomsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748B]">
            Showing {filtered.length} of {rooms.length} rooms
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 13].map((p, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                  p === 1
                    ? 'bg-[#020887] text-white'
                    : 'text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalMode && (
        <RoomFormModal
          room={selectedRoom}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteRoomModal
          roomName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
