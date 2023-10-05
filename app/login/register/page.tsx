'use client';

import RegisterForm from '@/shared/components/form/RegisterForm';
import ClvLogo from '@/shared/components/logo/clvlogo';
import { Space } from 'antd';
import React from 'react';

export default function Login() {
  return (
    <Space
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
      }}
    >
      <ClvLogo type='login' style={{ width: 350, height: 'auto' }}></ClvLogo>
      <RegisterForm />
    </Space>
  );
}
