import { Avatar, Layout, Space, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';
import ClvLogo from '../logo/clvlogo';

export default function DashBoardHeader() {
  const logoH = '10px';
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header style={{ background: '#f5f5f5' }}>
      <ClvLogo type='header' style={{ height: 60, marginTop: 60 }} />
      <Avatar></Avatar>
    </Header>
  );
}
