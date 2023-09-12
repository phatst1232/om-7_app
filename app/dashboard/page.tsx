'use client';

import TableAdminUser from '@/shared/components/test-table/admin-table--user';
import CustomAdminUserTable from '@/shared/components/table/custom-admin-user-table';
import { Space, theme } from 'antd';
import React from 'react';
import FullTableTest from '@/shared/components/test-table/test-full-table';

export default function DashboardHome() {
  return (
    <div>
      <CustomAdminUserTable />
      <TableAdminUser />
      <FullTableTest />
    </div>
  );
}
