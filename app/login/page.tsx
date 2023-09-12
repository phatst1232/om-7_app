'use client';

import LoginForm from '@/shared/components/form/login-form';
import ClvLogo from '@/shared/components/logo/clvlogo';
import { Space } from 'antd';
import React from 'react';

export default function DashboardHome() {
  return (
    <Space
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
      }}
    >
      <ClvLogo></ClvLogo>
      <LoginForm></LoginForm>
    </Space>
  );
}
