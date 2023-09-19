'use client';

import { useState } from 'react';
import { Avatar, Layout, Menu, MenuProps, Spin, theme } from 'antd';
import SideBarMenu from '@/shared/components/sider/sidebar';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ClvLogo from '@/shared/components/logo/clvlogo';
import { UserOutlined } from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          animation: 'infinite',
          display: 'inline-block',
        }}
        collapsible
        collapsed={collapsed}
        collapsedWidth='80'
        onCollapse={(value) => setCollapsed(value)}
      >
        <SideBarMenu></SideBarMenu>
      </Sider>
      {/* <Spin
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        spinning={status === 'loading'}
      > */}
      <Layout
        className='site-layout'
        style={{ minHeight: '100vh', marginLeft: collapsed ? 85 : 190 }}
      >
        <Header
          style={{
            // background: '#f5f5f5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ClvLogo style={{ height: '60%', width: 'auto', margin: '1rem' }} />
          <Avatar
            shape='circle'
            size='large'
            icon={<UserOutlined />}
            style={{ backgroundColor: '#97a3db', marginRight: '2.5rem' }}
          ></Avatar>
        </Header>
        <Content style={{ color: 'black', margin: '0 16px' }}>
          {status === 'loading' ? <p>Loading...</p> : children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          @Copyright CyberLogitec 2023
        </Footer>
      </Layout>
    </Layout>
  );
}
