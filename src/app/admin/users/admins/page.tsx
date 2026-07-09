'use client';

import { UserTable } from '@/components/admin/user-table';

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Administrators</h2>
      </div>
      {/* Passing both ADMIN and SUPER_ADMIN roles */}
      <UserTable roles={['ADMIN', 'SUPER_ADMIN']} />
    </div>
  );
}
