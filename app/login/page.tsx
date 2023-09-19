'use client';

import LoginForm from '@/shared/components/form/LoginForm';
import ClvLogo from '@/shared/components/logo/clvlogo';
import { Space } from 'antd';
import React from 'react';

export default function Login() {
  const clvLogoWidth = '';
  return (
    <Space
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
      }}
    >
      <ClvLogo type='login' style={{ width: 350, height: 'auto' }}></ClvLogo>
      <LoginForm></LoginForm>
    </Space>
  );
}
