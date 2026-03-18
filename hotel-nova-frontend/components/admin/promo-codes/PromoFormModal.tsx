'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown } from 'lucide-react';

const promoSchema = z.object({
  code: z
    .string()
    .min(2, 'Code is required')
    .regex(/^[A-Z0-9]+$/, 'Uppercase letters and numbers only — no spaces'),
  description: z.string().min(2, 'Description is required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1, 'Discount value must be at least 1'),
  usageLimit: z.number().min(1, 'Usage limit must be at least 1'),
  validFrom: z.string().min(1, 'Start date is required'),
  validTo: z.string().min(1, 'End date is required'),
  status: z.enum(['Active', 'Inactive', 'Scheduled']),
});

type PromoFormData = z.infer<typeof promoSchema>;

export interface PromoData {
  code: string;
  description: string;
  discount: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit: number;
  used: number;
  validFrom: string;
  validTo: string;
  status: string;
}

interface PromoFormModalProps {
  promo?: PromoData | null;
  onClose: () => void;
  onSave: (data: PromoData) => void;
}

const inputCls =
  'block w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 transition-all';

const selectCls =
  'block w-full h-12 px-4 pr-10 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 appearance-none cursor-pointer transition-all';

const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-2';
const errorCls = 'block text-[12px] text-[#EF4444] mt-1.5';

function toInputDate(display: string): string {
  try {
    const d = new Date(display);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function toDisplayDate(iso: string): string {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function PromoFormModal({ promo, onClose, onSave }: PromoFormModalProps) {
  const isEdit = !!promo;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
    defaultValues: promo
      ? {
          code: promo.code,
          description: promo.description,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          usageLimit: promo.usageLimit,
          validFrom: toInputDate(promo.validFrom),
          validTo: toInputDate(promo.validTo),
          status: (['Active', 'Inactive', 'Scheduled'].includes(promo.status)
            ? promo.status
            : 'Active') as PromoFormData['status'],
        }
      : { discountType: 'percentage', status: 'Active' },
  });

  const discountType = watch('discountType');

  const onSubmit = (data: PromoFormData) => {
    const discountDisplay =
      data.discountType === 'percentage'
        ? `${data.discountValue}%`
        : `₦${data.discountValue.toLocaleString()}`;

    onSave({
      code: data.code,
      description: data.description,
      discount: discountDisplay,
      discountType: data.discountType,
      discountValue: data.discountValue,
      usageLimit: data.usageLimit,
      used: promo?.used ?? 0,
      validFrom: toDisplayDate(data.validFrom),
      validTo: toDisplayDate(data.validTo),
      status: data.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="absolute inset-0 w-full h-full bg-black/50 cursor-default" onClick={onClose} aria-label="Close panel" />

      <div className="relative flex flex-col bg-[#F8FAFC] w-full sm:w-[540px] h-full shadow-2xl">
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between px-7 py-6 bg-white border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[20px] font-bold text-[#0D0F2B] leading-tight">
              {isEdit ? 'Edit Promo Code' : 'Add New Promo Code'}
            </h2>
            <p className="text-[14px] text-[#6B7280] mt-1">
              {isEdit ? 'Update the promo code details and status' : 'Create a new discount code for guests'}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors shrink-0 ml-4" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form id="promo-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Code Details */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Code Details</p>

            <div>
              <label className={labelCls}>Promo Code</label>
              <input
                {...register('code')}
                placeholder="e.g. GRAND25"
                className={inputCls}
                style={{ textTransform: 'uppercase' }}
                autoComplete="off"
              />
              <span className="block text-[12px] text-[#9CA3AF] mt-1.5">Uppercase letters and numbers only — no spaces or symbols</span>
              {errors.code && <span className={errorCls}>{errors.code.message}</span>}
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <input {...register('description')} placeholder="e.g. 25% off all suite bookings" className={inputCls} autoComplete="off" />
              {errors.description && <span className={errorCls}>{errors.description.message}</span>}
            </div>
          </div>

          {/* Discount */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Discount</p>

            <div>
              <label className={labelCls}>Discount Type</label>
              <div className="relative">
                <select {...register('discountType')} className={selectCls}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Discount Value</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6B7280] pointer-events-none select-none">
                    {discountType === 'percentage' ? '%' : '₦'}
                  </span>
                  <input
                    {...register('discountValue', { valueAsNumber: true })}
                    type="number"
                    placeholder={discountType === 'percentage' ? '25' : '50000'}
                    className={`${inputCls} pl-8`}
                    min={1}
                  />
                </div>
                {errors.discountValue && <span className={errorCls}>{errors.discountValue.message}</span>}
              </div>

              <div>
                <label className={labelCls}>Usage Limit</label>
                <input
                  {...register('usageLimit', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 100"
                  className={inputCls}
                  min={1}
                />
                {errors.usageLimit && <span className={errorCls}>{errors.usageLimit.message}</span>}
              </div>
            </div>
          </div>

          {/* Validity & Status */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Validity &amp; Status</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Valid From</label>
                <input {...register('validFrom')} type="date" className={inputCls} />
                {errors.validFrom && <span className={errorCls}>{errors.validFrom.message}</span>}
              </div>
              <div>
                <label className={labelCls}>Valid To</label>
                <input {...register('validTo')} type="date" className={inputCls} />
                {errors.validTo && <span className={errorCls}>{errors.validTo.message}</span>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Status</label>
              <div className="relative">
                <select {...register('status')} className={selectCls}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>
              {errors.status && <span className={errorCls}>{errors.status.message}</span>}
            </div>
          </div>

          <div className="h-2" />
        </form>

        {/* Footer */}
        <div className="shrink-0 px-7 py-4 border-t border-[#E5E7EB] bg-white flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 px-5 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            Cancel
          </button>
          <button type="submit" form="promo-form" className="h-10 px-7 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors">
            {isEdit ? 'Save Changes' : 'Create Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
