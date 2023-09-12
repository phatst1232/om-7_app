'use client';

import StyledComponentsRegistry from '@/lib/AntdRegistry';
import CustomAdminUserTable from '@/shared/components/table/custom-admin-user-table';
import { theme } from 'antd';
import React from 'react';

export default function DashboardHome() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    // <div style={{ padding: 24, color: 'rgb(0 0 0 / 88%)', textAlign: 'left' }}>
    <StyledComponentsRegistry>
      <CustomAdminUserTable />
    </StyledComponentsRegistry>
    // </div>
  );
}
