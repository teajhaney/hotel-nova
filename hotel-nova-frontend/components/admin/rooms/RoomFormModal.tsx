'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown, UploadCloud, Trash2, Loader2, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { RoomFormModalProps } from '@/type/interface';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useCreateRoom, useUpdateRoom, useUploadRoomPhoto } from '@/hooks/use-rooms';
import { extractApiError } from '@/lib/api-error';

const M = ADMIN_DASHBOARD_MESSAGES;

const roomSchema = z.object({
  name: z.string().min(2, 'Room name is required'),
  roomNumber: z.number().int().min(1, 'Room number must be at least 1'),
  type: z.enum(['Standard', 'Deluxe', 'Executive', 'Suite']),
  price: z.number().min(10, 'Minimum price is ₦10'),
  status: z.enum(['Available', 'Occupied', 'Maintenance']),
  description: z.string().optional(),
  beds: z.string().optional(),
  maxGuests: z.number().int().min(1).optional(),
  sqm: z.number().int().min(1).optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

const inputCls =
  'block w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 transition-all';

const selectCls =
  'block w-full h-12 px-4 pr-10 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 appearance-none cursor-pointer transition-all';

const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-2';

const errorCls = 'block text-[12px] text-[#EF4444] mt-1.5';

export function RoomFormModal({ room, onClose, onSave }: RoomFormModalProps) {
  const isEdit = !!room;

  const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutateAsync: uploadPhoto, isPending: isUploading } =
    useUploadRoomPhoto();

  const isSaving = isCreating || isUpdating || isUploading;

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>(
    isEdit ? room.image : '',
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amenities, setAmenities] = useState<string[]>(room?.amenities ?? []);
  const [amenityInput, setAmenityInput] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);

  // Lock body scroll while the modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room
      ? {
          name: room.name,
          roomNumber: room.roomNumber,
          type: room.type as RoomFormData['type'],
          // Convert kobo (stored in DB) back to naira for display in the form
          price: room.price / 100,
          status: room.status as RoomFormData['status'],
          description: room.description ?? '',
          beds: room.beds ?? '',
          maxGuests: room.maxGuests ?? undefined,
          sqm: room.sqm ?? undefined,
        }
      : { type: 'Standard', status: 'Available', maxGuests: 2 },
  });

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

  const addAmenity = () => {
    const trimmed = amenityInput.trim().replace(/,$/, '');
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setAmenityInput('');
  };

  const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addAmenity();
    }
    if (e.key === 'Backspace' && amenityInput === '' && amenities.length > 0) {
      setAmenities((prev) => prev.slice(0, -1));
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RoomFormData) => {
    setServerError(null);
    try {
      // Convert naira (form input) to kobo (backend/DB storage).
      // Math.round handles floating-point (e.g. 4000.23 × 100 = 400023).
      const priceInKobo = Math.round(data.price * 100);

      const payload = {
        roomNumber: data.roomNumber,
        name: data.name,
        type: data.type,
        price: priceInKobo,
        status: data.status,
        description: data.description || undefined,
        beds: data.beds || undefined,
        maxGuests: data.maxGuests,
        sqm: data.sqm,
        amenities,
      };

      let savedId: string;

      if (isEdit && room.id) {
        const updated = await updateRoom({ id: room.id, payload });
        savedId = updated.id;
      } else {
        const created = await createRoom(payload);
        savedId = created.id;
      }

      if (uploadedFile) {
        await uploadPhoto({ id: savedId, file: uploadedFile });
      }

      onSave();
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  // WHY createPortal:
  // Framer Motion applies CSS transforms to motion.div elements during animation.
  // CSS rule: any element with a transform becomes the containing block for ALL
  // position:fixed descendants — breaking viewport-relative fixed positioning.
  // createPortal renders the modal directly under document.body, completely
  // outside the React tree's admin layout (which may have motion ancestors).
  //
  // WHY flex flex-col h-screen on the drawer (NOT overflow-y-auto on the drawer):
  // The drawer itself must be exactly viewport height. Inside it, we use a
  // flex column: fixed-height header → flex-1 scrollable content area → fixed-height footer.
  // This gives independent scrolling for just the form content, with the header
  // and footer always visible.

  // createPortal requires the DOM — bail out during SSR
  if (typeof window === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[49] bg-black/50 cursor-default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        role="button"
        aria-label={M.closePanelAriaLabel}
        tabIndex={-1}
      />

      {/* Drawer — slides in from the right.
          flex flex-col h-screen keeps it exactly viewport-tall.
          The content area (flex-1 + overflow-y-auto) is the ONLY part that scrolls. */}
      <motion.div
        className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[600px] flex flex-col bg-[#F8FAFC] shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Header — always visible at the top */}
        <div className="shrink-0 flex items-start justify-between px-7 py-6 bg-white border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[20px] font-bold text-[#0D0F2B] leading-tight">
              {isEdit ? M.roomFormEditTitle : M.roomFormAddTitle}
            </h2>
            <p className="text-[14px] text-[#6B7280] mt-1">
              {isEdit ? M.roomFormEditSubtitle : M.roomFormAddSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors shrink-0 ml-4"
            aria-label={M.closeAriaLabel}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content area — this is the ONLY thing that scrolls */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
        <form
          id="room-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-7 py-6 space-y-5"
        >
          {/* ─ Basic Info ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
              {M.roomSectionBasicInfo}
            </p>

            <div>
              <label className={labelCls}>{M.roomLabelName}</label>
              <input
                {...register('name')}
                placeholder={M.roomPlaceholderName}
                className={inputCls}
                autoComplete="off"
              />
              {errors.name && (
                <span className={errorCls}>{errors.name.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{M.roomLabelCode}</label>
                <input
                  {...register('roomNumber', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 302"
                  className={inputCls}
                  min={1}
                  autoComplete="off"
                />
                <span className="block text-[11px] text-[#9CA3AF] mt-1.5">
                  {M.roomHintCode}
                </span>
                {errors.roomNumber && (
                  <span className={errorCls}>{errors.roomNumber.message}</span>
                )}
              </div>

              <div>
                <label className={labelCls}>{M.roomLabelType}</label>
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
                {errors.type && (
                  <span className={errorCls}>{errors.type.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* ─ Pricing & Status ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
              {M.roomSectionPricing}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{M.roomLabelPrice}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6B7280] pointer-events-none select-none">
                    ₦
                  </span>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="1,750"
                    className={`${inputCls} pl-8`}
                    min={0}
                  />
                </div>
                <span className="block text-[11px] text-[#9CA3AF] mt-1.5">
                  Enter price in naira (e.g. 4000.23 = ₦4,000 and 23 kobo)
                </span>
                {errors.price && (
                  <span className={errorCls}>{errors.price.message}</span>
                )}
              </div>

              <div>
                <label className={labelCls}>{M.roomLabelStatus}</label>
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
                {errors.status && (
                  <span className={errorCls}>{errors.status.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* ─ Room Details ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
              {M.roomSectionDetails}{' '}
              <span className="ml-1 text-[11px] font-normal normal-case tracking-normal">
                {M.roomDescriptionOptional}
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{M.roomLabelBeds}</label>
                <input
                  {...register('beds')}
                  placeholder={M.roomPlaceholderBeds}
                  className={inputCls}
                  autoComplete="off"
                />
                {errors.beds && (
                  <span className={errorCls}>{errors.beds.message}</span>
                )}
              </div>

              <div>
                <label className={labelCls}>{M.roomLabelMaxGuests}</label>
                <input
                  {...register('maxGuests', { valueAsNumber: true })}
                  type="number"
                  placeholder="2"
                  className={inputCls}
                  min={1}
                />
                {errors.maxGuests && (
                  <span className={errorCls}>{errors.maxGuests.message}</span>
                )}
              </div>
            </div>

            <div className="sm:w-1/2 sm:pr-2">
              <label className={labelCls}>{M.roomLabelSqm}</label>
              <div className="relative">
                <input
                  {...register('sqm', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 42"
                  className={`${inputCls} pr-14`}
                  min={1}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF] pointer-events-none select-none">
                  sqm
                </span>
              </div>
              {errors.sqm && (
                <span className={errorCls}>{errors.sqm.message}</span>
              )}
            </div>
          </div>

          {/* ─ Amenities ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
              {M.roomSectionAmenities}{' '}
              <span className="ml-1 text-[11px] font-normal normal-case tracking-normal">
                {M.roomDescriptionOptional}
              </span>
            </p>

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {amenities.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF0FF] text-[#020887] text-[13px] font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeAmenity(i)}
                      className="hover:text-[#EF4444] transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={handleAmenityKeyDown}
                placeholder={M.roomAmenitiesPlaceholder}
                className={inputCls}
              />
              <button
                type="button"
                onClick={addAmenity}
                disabled={!amenityInput.trim()}
                className="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-[#020887] text-white hover:bg-[#38369A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Add amenity"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mt-2">
              {M.roomAmenitiesHint}
            </p>
          </div>

          {/* ─ Description ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
              {M.roomSectionDescription}
              <span className="ml-2 text-[11px] font-normal normal-case tracking-normal text-[#9CA3AF]">
                {M.roomDescriptionOptional}
              </span>
            </p>
            <textarea
              {...register('description')}
              rows={5}
              placeholder={M.roomPlaceholderDescription}
              className="block w-full px-4 py-3.5 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 resize-none transition-all"
            />
          </div>

          {/* ─ Room Image ─ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
              {M.roomSectionImage}
            </p>

            {uploadPreview ? (
              <div className="relative w-full h-52 rounded-xl overflow-hidden border border-[#E5E7EB] group mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadPreview}
                  alt="Room preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-[13px] font-semibold text-[#EF4444] shadow-lg hover:bg-[#FEE2E2]"
                  >
                    <Trash2 size={14} />
                    {M.roomRemoveImage}
                  </button>
                </div>
                {uploadedFile && (
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md max-w-[220px] truncate">
                    {uploadedFile.name}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`block w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer mb-4 ${
                  isDragging
                    ? 'border-[#020887] bg-[#EEF0FF]'
                    : 'border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#020887] hover:bg-[#EEF0FF]'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
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
                    {M.roomUploadPrompt}
                  </p>
                  <p className="text-[13px] text-[#9CA3AF] mt-1">
                    {M.roomUploadFormats}
                  </p>
                </div>
              </div>
            )}

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
          </div>

          {/* Space so footer doesn't overlap last field */}
          <div className="h-2" />
        </form>
        </div>

        {/* Footer — always visible at the bottom */}
        <div className="shrink-0 px-7 py-4 border-t border-[#E5E7EB] bg-white">
          {serverError && (
            <p className="text-[12px] text-[#EF4444] mb-3 text-right">
              {serverError}
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-10 px-5 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              {M.cancel}
            </button>
            <button
              type="submit"
              form="room-form"
              disabled={isSaving}
              className="h-10 px-7 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? M.saveChanges : M.roomSubmitAdd}
            </button>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}
