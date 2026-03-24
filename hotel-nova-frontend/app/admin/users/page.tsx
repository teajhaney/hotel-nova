'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  ShieldCheck,
  UserCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { UserFormModal, type UserData } from '@/components/admin/users/UserFormModal';
import { DeleteUserModal } from '@/components/admin/users/DeleteUserModal';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useAdminUsers, type AdminApiUser } from '@/hooks/use-admin-users';

const M = ADMIN_DASHBOARD_MESSAGES;

type RoleFilter = 'All' | 'Admins' | 'Guests';

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7', '#F3E8FF', '#ECFDF5'];
const AVATAR_TEXT   = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309', '#7C3AED', '#059669'];

const ROLE_BADGE: Record<string, string> = {
  GUEST: 'bg-[#F1F5F9] text-[#64748B]',
  ADMIN: 'bg-[#EEF0FF] text-[#020887]',
};

const ROLE_TABS: { key: RoleFilter; label: string }[] = [
  { key: 'All',    label: M.userTabAll    },
  { key: 'Admins', label: M.userTabAdmins },
  { key: 'Guests', label: M.userTabGuests },
];

// Convert an API user into the UserData shape the modal expects
function toUserData(u: AdminApiUser): UserData {
  return {
    id: u.id,
    name: u.fullName,
    email: u.email,
    role: u.role,
    status: u.status,
    joined: new Date(u.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [page, setPage] = useState(1);

  // Pass role filter to the API when it's not "All"
  const apiRole = roleFilter === 'Admins' ? 'ADMIN' : roleFilter === 'Guests' ? 'GUEST' : undefined;
  const { data, isLoading } = useAdminUsers({ role: apiRole, page, limit: 20 });

  const users = data?.data ?? [];
  const meta  = data?.meta;

  // Modal state
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setModalMode('add');
  };

  const handleOpenEdit = (user: AdminApiUser) => {
    setSelectedUser(toUserData(user));
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  // Called by the modal after a successful API save — the hook already
  // invalidates the query so the table refetches automatically.
  const handleSaved = () => {
    handleCloseModal();
  };

  // Called by DeleteUserModal after a confirmed delete — the hook already
  // invalidates the query so the table refetches automatically.
  const handleDeleted = () => {
    setDeleteTarget(null);
  };

  // Derive stat counts from the current page data.
  // For accurate totals across all pages we'd need a dedicated count endpoint;
  // for now we show what the server told us in the meta.
  const totalUsers  = meta?.total ?? 0;
  const adminCount  = users.filter((u) => u.role === 'ADMIN').length;
  const activeCount = users.filter((u) => u.status === 'Active').length;

  const STATS = [
    { label: M.userStatTotalUsers,    value: isLoading ? '—' : String(totalUsers), icon: Users },
    { label: M.userStatActiveGuests,  value: isLoading ? '—' : String(activeCount), icon: UserCheck },
    { label: M.userStatAdminAccounts, value: isLoading ? '—' : String(adminCount),  icon: ShieldCheck },
  ];

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.usersTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-1">{M.usersSubtitle}</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors"
        >
          <Plus size={16} />
          {M.addAdmin}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="admin-stat-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#020887]" />
            </div>
            <div>
              <p className="text-[13px] text-[#64748B]">{label}</p>
              <p className="text-[22px] font-bold text-[#0D0F2B]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="admin-card overflow-hidden">
        {/* Card header: title + role filter tabs */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B]">{M.userDirectoryTitle}</h2>

          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg">
            {ROLE_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setRoleFilter(key); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  roleFilter === key
                    ? 'bg-[#020887] text-white'
                    : 'text-[#64748B] hover:text-[#0D0F2B]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#020887]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="admin-table-th">{M.usersColUser}</th>
                  <th className="admin-table-th">{M.usersColEmail}</th>
                  <th className="admin-table-th">{M.usersColRole}</th>
                  <th className="admin-table-th">{M.usersColStatus}</th>
                  <th className="admin-table-th">{M.usersColJoined}</th>
                  <th className="admin-table-th">{M.usersColActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {users.map((user, i) => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            color: AVATAR_TEXT[i % AVATAR_TEXT.length],
                          }}
                        >
                          {user.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span className="text-[13px] font-medium text-[#0D0F2B] whitespace-nowrap">
                          {user.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B]">{user.email}</td>
                    <td className="admin-table-td">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${ROLE_BADGE[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="admin-table-td">
                      <div
                        className={`flex items-center gap-1.5 text-[13px] font-medium ${
                          user.status === 'Active' ? 'text-[#10B981]' : 'text-[#94A3B8]'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#CBD5E1]'
                          }`}
                        />
                        {user.status}
                      </div>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B] whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                          aria-label={M.editUserAriaLabel}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(toUserData(user))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                          aria-label={M.deleteUserAriaLabel}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                      No {roleFilter === 'All' ? '' : roleFilter.toLowerCase()} found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <p className="text-[13px] text-[#64748B]">
              Showing {users.length} of {meta.total} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
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
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887] disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
        {meta && meta.totalPages <= 1 && (
          <div className="px-5 py-4 border-t border-[#E2E8F0]">
            <p className="text-[13px] text-[#64748B]">
              Showing {users.length} of {meta.total} users
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Drawer */}
      {modalMode && (
        <UserFormModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteUserModal
          userId={deleteTarget.id}
          userName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
