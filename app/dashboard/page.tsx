'use client';

import TableAdminUser from '@/shared/components/test-table/admin-table--user';
import CustomAdminUserTable from '@/shared/components/table/custom-admin-user-table';
import { theme } from 'antd';
import React from 'react';
import FullTableTest from '@/shared/components/test-table/test-full-table';

export default function DashboardHome() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div
      className='w_content'
      style={{ padding: 24, background: colorBgContainer }}
    >
      {/* <h1 className='table-title'>Custom Admin User table</h1> */}
      <CustomAdminUserTable />
      <FullTableTest />
      <TableAdminUser />
    </div>
  );
}
