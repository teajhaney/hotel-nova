'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown, Mail, User, ShieldCheck, CalendarDays, Info } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
export interface UserData {
  name: string;
  email: string;
  role: 'ADMIN' | 'GUEST';
  status: 'Active' | 'Inactive';
  joined: string;
}

interface UserFormModalProps {
  user?: UserData | null; // null / undefined = add mode
  onClose: () => void;
  onSave: (data: UserData) => void;
}

// ── Schemas ──────────────────────────────────────────────────
const addSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['ADMIN', 'GUEST']),
});

const editSchema = z.object({
  role: z.enum(['ADMIN', 'GUEST']),
  status: z.enum(['Active', 'Inactive']),
});

type AddFormData = z.infer<typeof addSchema>;
type EditFormData = z.infer<typeof editSchema>;

// ── Shared styles ────────────────────────────────────────────
const inputCls =
  'block w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 transition-all';

const selectCls =
  'block w-full h-12 px-4 pr-10 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 appearance-none cursor-pointer transition-all';

const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-2';
const errorCls = 'block text-[12px] text-[#EF4444] mt-1.5';

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7'];
const AVATAR_TEXT = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309'];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ── Add User Form ─────────────────────────────────────────────
function AddForm({ onClose, onSave }: { onClose: () => void; onSave: (d: UserData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddFormData>({
    resolver: zodResolver(addSchema),
    defaultValues: { role: 'ADMIN' },
  });

  const onSubmit = (data: AddFormData) => {
    onSave({
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  };

  return (
    <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
      {/* Full Name */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
          Account Details
        </p>

        <div>
          <label className={labelCls}>Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input {...register('name')} placeholder="e.g. Amara Okonkwo" className={`${inputCls} pl-10`} autoComplete="off" />
          </div>
          {errors.name && <span className={errorCls}>{errors.name.message}</span>}
        </div>

        <div>
          <label className={labelCls}>Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input {...register('email')} type="email" placeholder="e.g. amara@grandoasis.com" className={`${inputCls} pl-10`} autoComplete="off" />
          </div>
          {errors.email && <span className={errorCls}>{errors.email.message}</span>}
        </div>

        <div>
          <label className={labelCls}>Role</label>
          <div className="relative">
            <select {...register('role')} className={selectCls}>
              <option value="ADMIN">Admin</option>
              <option value="GUEST">Guest</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
          {errors.role && <span className={errorCls}>{errors.role.message}</span>}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-[#EEF0FF] rounded-xl border border-[#C7D2FE]">
        <Info size={16} className="text-[#020887] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#374151] leading-relaxed">
          For <strong>Admin</strong> accounts, a temporary password and setup link will be sent to the provided email address. Guests must register through the public signup page.
        </p>
      </div>

      <div className="h-2" />
    </form>
  );
}

// ── Edit User Form ────────────────────────────────────────────
function EditForm({
  user,
  onClose,
  onSave,
}: {
  user: UserData;
  onClose: () => void;
  onSave: (d: UserData) => void;
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: { role: user.role, status: user.status },
  });

  const roleValue = watch('role');
  const statusValue = watch('status');

  const avatarIndex = user.name.charCodeAt(0) % AVATAR_COLORS.length;

  const onSubmit = (data: EditFormData) => {
    onSave({ ...user, role: data.role, status: data.status });
  };

  return (
    <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
      {/* Profile card (read-only) */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
          User Profile
        </p>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-[17px] font-bold"
            style={{
              backgroundColor: AVATAR_COLORS[avatarIndex],
              color: AVATAR_TEXT[avatarIndex],
            }}
          >
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-[#0D0F2B] truncate">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail size={13} className="text-[#9CA3AF] shrink-0" />
              <p className="text-[13px] text-[#6B7280] truncate">{user.email}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CalendarDays size={13} className="text-[#9CA3AF] shrink-0" />
              <p className="text-[13px] text-[#6B7280]">Joined {user.joined}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editable settings */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
          Account Settings
        </p>

        {/* Role */}
        <div>
          <label className={labelCls}>Role</label>
          <div className="relative">
            <select {...register('role')} className={selectCls}>
              <option value="GUEST">Guest</option>
              <option value="ADMIN">Admin</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
          <span className="block text-[12px] text-[#9CA3AF] mt-1.5">
            {roleValue === 'ADMIN'
              ? 'Admin accounts have full access to the management dashboard.'
              : 'Guest accounts can browse rooms and manage their own bookings.'}
          </span>
        </div>

        {/* Status */}
        <div>
          <label className={labelCls}>Account Status</label>
          <div className="relative">
            <select {...register('status')} className={selectCls}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive (suspended)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
          <span className="block text-[12px] text-[#9CA3AF] mt-1.5">
            {statusValue === 'Inactive'
              ? 'Suspended accounts cannot log in or make new bookings.'
              : 'Account is active and has full access based on their role.'}
          </span>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-[#FFFBEB] rounded-xl border border-[#FDE68A]">
        <ShieldCheck size={16} className="text-[#B45309] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#374151] leading-relaxed">
          Name and email can only be changed by the account holder in their profile settings.
        </p>
      </div>

      <div className="h-2" />
    </form>
  );
}

// ── Main Modal ────────────────────────────────────────────────
export function UserFormModal({ user, onClose, onSave }: UserFormModalProps) {
  const isEdit = !!user;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Close panel"
      />

      {/* Drawer */}
      <div className="relative flex flex-col bg-[#F8FAFC] w-full sm:w-[500px] h-full shadow-2xl">
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between px-7 py-6 bg-white border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[20px] font-bold text-[#0D0F2B] leading-tight">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="text-[14px] text-[#6B7280] mt-1">
              {isEdit
                ? 'Update this user\'s role and account status'
                : 'Create a new admin or guest account manually'}
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

        {/* Form (conditionally rendered) */}
        {isEdit ? (
          <EditForm user={user} onClose={onClose} onSave={onSave} />
        ) : (
          <AddForm onClose={onClose} onSave={onSave} />
        )}

        {/* Footer */}
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
            form="user-form"
            className="h-10 px-7 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors"
          >
            {isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
