'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { RoomFormModal, type RoomData } from '@/components/admin/rooms/RoomFormModal';
import { DeleteRoomModal } from '@/components/admin/rooms/DeleteRoomModal';

const INITIAL_ROOMS: RoomData[] = [
  {
    id: 'RN-302-DX',
    name: 'Deluxe King 302',
    type: 'Deluxe',
    price: 175000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-501-PS',
    name: 'Presidential Suite 501',
    type: 'Suite',
    price: 600000,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-215-ST',
    name: 'Standard Double 215',
    type: 'Standard',
    price: 90000,
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-410-EX',
    name: 'Executive View 410',
    type: 'Executive',
    price: 275000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-601-GS',
    name: 'Grand Suite 601',
    type: 'Suite',
    price: 850000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-118-DT',
    name: 'Deluxe Twin 118',
    type: 'Deluxe',
    price: 155000,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-210-SS',
    name: 'Standard Single 210',
    type: 'Standard',
    price: 75000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-315-EC',
    name: 'Executive Corner 315',
    type: 'Executive',
    price: 320000,
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e3?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-420-PN',
    name: 'Penthouse North 420',
    type: 'Suite',
    price: 1200000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=128&h=128&fit=crop&auto=format',
  },
  {
    id: 'RN-108-SQ',
    name: 'Standard Queen 108',
    type: 'Standard',
    price: 82000,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1565791380713-1756b9a05343?w=128&h=128&fit=crop&auto=format',
  },
];

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
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modal state
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomData | null>(null);

  const filtered = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchStatus = statusFilter === 'All Statuses' || r.status === statusFilter;
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
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">Manage Rooms</h1>
          <p className="text-[14px] text-[#64748B] mt-1">{rooms.length} rooms in inventory</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors"
        >
          <Plus size={16} />
          Add New Room
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white">
          <Search size={15} className="text-[#94A3B8] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="flex-1 text-[14px] bg-transparent border-none outline-none text-[#0D0F2B] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>All Types</option>
            <option>Deluxe</option>
            <option>Suite</option>
            <option>Standard</option>
            <option>Executive</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Available</option>
            <option>Occupied</option>
            <option>Maintenance</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">Room Info</th>
                <th className="admin-table-th">Type</th>
                <th className="admin-table-th">Price / Night</th>
                <th className="admin-table-th">Status</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((room) => (
                <tr key={room.id} className="hover:bg-[#F8FAFC] transition-colors">
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
                        <p className="text-[13px] font-semibold text-[#0D0F2B]">{room.name}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">{room.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-td text-[13px] text-[#64748B]">{room.type}</td>
                  <td className="admin-table-td text-[13px] font-medium text-[#0D0F2B]">
                    ₦{room.price.toLocaleString()}
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
                        aria-label="Edit room"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(room)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                        aria-label="Delete room"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    No rooms match your search or filters
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
