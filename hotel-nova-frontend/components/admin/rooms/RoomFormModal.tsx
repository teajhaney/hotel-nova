'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown, UploadCloud, ImageIcon, Trash2 } from 'lucide-react';
import { RoomFormModalProps } from '@/type/type';

const roomSchema = z.object({
  name: z.string().min(2, 'Room name is required'),
  roomCode: z
    .string()
    .min(2, 'Room code is required')
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers, and hyphens (e.g. RN-302-DX)'),
  type: z.enum(['Standard', 'Deluxe', 'Executive', 'Suite']),
  price: z.number().min(1000, 'Minimum price is ₦1,000'),
  status: z.enum(['Available', 'Occupied', 'Maintenance']),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;



const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=128&h=128&fit=crop&auto=format';

// Reusable inline styles to avoid Tailwind v4 @apply display issues
const inputCls =
  'block w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 transition-all';

const selectCls =
  'block w-full h-12 px-4 pr-10 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 appearance-none cursor-pointer transition-all';

const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-2';

const errorCls = 'block text-[12px] text-[#EF4444] mt-1.5';

const hintCls = 'block text-[12px] text-[#9CA3AF] mt-1.5';

export function RoomFormModal({ room, onClose, onSave }: RoomFormModalProps) {
  const isEdit = !!room;

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>(isEdit ? room.image : '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
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
          imageUrl: room.image.startsWith('http') ? room.image : '',
        }
      : { type: 'Standard', status: 'Available' },
  });

  const imageUrlValue = watch('imageUrl');

  const previewSrc =
    uploadedFile && uploadPreview
      ? uploadPreview
      : imageUrlValue?.trim()
      ? imageUrlValue.trim()
      : uploadPreview || '';

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadedFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setUploadPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (data: RoomFormData) => {
    const resolvedImage =
      uploadedFile && uploadPreview
        ? uploadPreview
        : data.imageUrl?.trim() || DEFAULT_IMAGE;

    onSave({
      id: data.roomCode,
      name: data.name,
      type: data.type,
      price: data.price,
      status: data.status,
      description: data.description,
      image: resolvedImage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Close panel"
      />

      {/* Drawer */}
      <div className="relative flex flex-col bg-[#F8FAFC] w-full sm:w-[600px] h-full shadow-2xl">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="shrink-0 flex items-start justify-between px-7 py-6 bg-white border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[20px] font-bold text-[#0D0F2B] leading-tight">
              {isEdit ? 'Edit Room' : 'Add New Room'}
            </h2>
            <p className="text-[14px] text-[#6B7280] mt-1">
              {isEdit
                ? 'Update the room details and availability status'
                : 'Fill in the details below to add a new room to the inventory'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors shrink-0 ml-4"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable Body ─────────────────────────────── */}
        <form
          id="room-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-7 py-6 space-y-5"
        >

          {/* ─ Section: Basic Info ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
              Basic Information
            </p>

            {/* Room Name */}
            <div>
              <label className={labelCls}>Room Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Deluxe King Suite 302"
                className={inputCls}
                autoComplete="off"
              />
              {errors.name && <span className={errorCls}>{errors.name.message}</span>}
            </div>

            {/* Room Code + Type — 2 col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Room Code</label>
                <input
                  {...register('roomCode')}
                  placeholder="e.g. RN-302-DX"
                  className={inputCls}
                  style={{ textTransform: 'uppercase' }}
                  autoComplete="off"
                />
                <span className={hintCls}>Uppercase letters, numbers &amp; hyphens only</span>
                {errors.roomCode && <span className={errorCls}>{errors.roomCode.message}</span>}
              </div>

              <div>
                <label className={labelCls}>Room Type</label>
                <div className="relative">
                  <select {...register('type')} className={selectCls}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive">Executive</option>
                    <option value="Suite">Suite</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                  />
                </div>
                {errors.type && <span className={errorCls}>{errors.type.message}</span>}
              </div>
            </div>
          </div>

          {/* ─ Section: Pricing & Status ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
              Pricing &amp; Availability
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price per Night</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6B7280] pointer-events-none select-none">
                    ₦
                  </span>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    placeholder="175,000"
                    className={`${inputCls} pl-8`}
                    min={0}
                  />
                </div>
                {errors.price && <span className={errorCls}>{errors.price.message}</span>}
              </div>

              <div>
                <label className={labelCls}>Availability Status</label>
                <div className="relative">
                  <select {...register('status')} className={selectCls}>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                  />
                </div>
                {errors.status && <span className={errorCls}>{errors.status.message}</span>}
              </div>
            </div>
          </div>

          {/* ─ Section: Description ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
              Description
              <span className="ml-2 text-[11px] font-normal normal-case tracking-normal text-[#9CA3AF]">
                (optional)
              </span>
            </p>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="Describe the room — highlight key features, views, furnishings, bed type, and included amenities..."
              className="block w-full px-4 py-3.5 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 resize-none transition-all"
            />
          </div>

          {/* ─ Section: Room Image ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
              Room Image
            </p>

            {/* Upload preview */}
            {previewSrc ? (
              <div className="relative w-full h-52 rounded-xl overflow-hidden border border-[#E5E7EB] group mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Room preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-[13px] font-semibold text-[#EF4444] shadow-lg hover:bg-[#FEE2E2]"
                  >
                    <Trash2 size={14} />
                    Remove image
                  </button>
                </div>
                {uploadedFile && (
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md max-w-[220px] truncate">
                    {uploadedFile.name}
                  </div>
                )}
              </div>
            ) : (
              /* Drag-and-drop zone */
              <div
                className={`block w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer mb-4 ${
                  isDragging
                    ? 'border-[#020887] bg-[#EEF0FF]'
                    : 'border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#020887] hover:bg-[#EEF0FF]'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              >
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#EEF0FF] flex items-center justify-center mb-3">
                    <UploadCloud size={24} className="text-[#020887]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#111827]">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="text-[13px] text-[#9CA3AF] mt-1">
                    PNG, JPG, WebP — max 5 MB
                  </p>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            {/* OR divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                or paste an image URL
              </span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* URL input */}
            <div className="relative">
              <ImageIcon
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <input
                {...register('imageUrl')}
                placeholder="https://images.unsplash.com/photo-..."
                className={`${inputCls} pl-10`}
                autoComplete="off"
              />
            </div>
            <span className="block text-[12px] text-[#9CA3AF] mt-2">
              Uploaded file takes priority over URL if both are provided.
            </span>
          </div>

          {/* Bottom padding so footer doesn't cover last field */}
          <div className="h-2" />
        </form>

        {/* ── Fixed Footer ────────────────────────────────── */}
        <div className="shrink-0 px-7 py-4 border-t border-[#E5E7EB] bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="room-form"
            className="h-10 px-7 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors"
          >
            {isEdit ? 'Save Changes' : 'Add Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
