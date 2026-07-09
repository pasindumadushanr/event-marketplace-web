'use client';

import { UserTable } from '@/components/admin/user-table';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">All Users</h2>
      </div>
      <UserTable />
    </div>
  );
}
