'use client';

import TableAdminUser from '@/shared/components/test-table/admin-table--user';
import UserManagementTable from '@/shared/components/table/UserManagementTable';
import { Space, theme } from 'antd';
import React from 'react';
import FullTableTest from '@/shared/components/test-table/test-full-table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardHome() {
  return (
    <div>
      <UserManagementTable />
      {/* <TableAdminUser />
      <FullTableTest /> */}
    </div>
  );
}
