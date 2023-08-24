"use client"

import TableAdminUser from '@/shared/components/table/admin-table--user';
import TestTable1 from '@/shared/components/table/test-editable-table';
import { Layout, theme } from 'antd'
import React from 'react';

export default function DashboardHome() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div style={{ padding: 24, color: 'rgb(0 0 0 / 88%)', textAlign: 'left'}}>
      <h1>User Management</h1>
      <TableAdminUser/>
      {/* <TestTable1/> */}
    </div>
  )
}
