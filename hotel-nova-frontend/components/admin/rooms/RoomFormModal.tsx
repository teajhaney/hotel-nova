'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown } from 'lucide-react';

const roomSchema = z.object({
  name: z.string().min(2, 'Room name is required'),
  roomCode: z
    .string()
    .min(2, 'Room code is required')
    .regex(/^[A-Z0-9-]+$/, 'Uppercase letters, numbers, and hyphens only (e.g. RN-302-DX)'),
  type: z.enum(['Standard', 'Deluxe', 'Executive', 'Suite']),
  price: z.coerce.number().min(1000, 'Minimum price is ₦1,000'),
  status: z.enum(['Available', 'Occupied', 'Maintenance']),
  description: z.string().optional(),
  image: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

export interface RoomData {
  id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  image: string;
  description?: string;
}

interface RoomFormModalProps {
  room?: RoomData | null;
  onClose: () => void;
  onSave: (data: RoomData) => void;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=128&h=128&fit=crop&auto=format';

export function RoomFormModal({ room, onClose, onSave }: RoomFormModalProps) {
  const isEdit = !!room;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room
      ? {
          name: room.name,
          roomCode: room.id,
          type: room.type as RoomFormData['type'],
          price: room.price,
          status: room.status as RoomFormData['status'],
          description: room.description ?? '',
          image: room.image,
        }
      : {
          type: 'Standard',
          status: 'Available',
        },
  });

  const onSubmit = (data: RoomFormData) => {
    onSave({
      id: data.roomCode,
      name: data.name,
      type: data.type,
      price: data.price,
      status: data.status,
      description: data.description,
      image: data.image?.trim() || DEFAULT_IMAGE,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-[17px] font-bold text-[#0D0F2B]">
              {isEdit ? 'Edit Room' : 'Add New Room'}
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              {isEdit
                ? 'Update room details and availability'
                : 'Fill in the details to add a room to the inventory'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors shrink-0 ml-3"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Room Name */}
          <div>
            <label className="admin-form-label">Room Name</label>
            <input
              {...register('name')}
              placeholder="e.g. Deluxe King 302"
              className="admin-form-input"
            />
            {errors.name && <p className="admin-form-error">{errors.name.message}</p>}
          </div>

          {/* Room Code + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Room Code</label>
              <input
                {...register('roomCode')}
                placeholder="e.g. RN-302-DX"
                className="admin-form-input uppercase"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.roomCode && <p className="admin-form-error">{errors.roomCode.message}</p>}
            </div>
            <div>
              <label className="admin-form-label">Room Type</label>
              <div className="relative">
                <select {...register('type')} className="admin-form-select pr-8">
                  <option>Standard</option>
                  <option>Deluxe</option>
                  <option>Executive</option>
                  <option>Suite</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                />
              </div>
              {errors.type && <p className="admin-form-error">{errors.type.message}</p>}
            </div>
          </div>

          {/* Price + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Price per Night (₦)</label>
              <input
                {...register('price')}
                type="number"
                placeholder="e.g. 175000"
                className="admin-form-input"
              />
              {errors.price && <p className="admin-form-error">{errors.price.message}</p>}
            </div>
            <div>
              <label className="admin-form-label">Status</label>
              <div className="relative">
                <select {...register('status')} className="admin-form-select pr-8">
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                />
              </div>
              {errors.status && <p className="admin-form-error">{errors.status.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="admin-form-label">
              Description
              <span className="ml-1.5 text-[11px] font-normal text-[#94A3B8]">(optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Briefly describe the room features, views, or amenities..."
              className="admin-form-textarea"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="admin-form-label">
              Image URL
              <span className="ml-1.5 text-[11px] font-normal text-[#94A3B8]">
                (optional — file upload coming soon)
              </span>
            </label>
            <input
              {...register('image')}
              placeholder="https://images.unsplash.com/..."
              className="admin-form-input"
            />
            {errors.image && <p className="admin-form-error">{errors.image.message}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-[#E2E8F0] text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
