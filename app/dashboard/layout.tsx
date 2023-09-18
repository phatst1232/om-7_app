'use client';

import { useState } from 'react';
import { Layout, Menu, MenuProps, theme } from 'antd';
import SideBarMenu from '@/shared/components/sider/sidebar';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
      <Layout
        className='site-layout'
        style={{ minHeight: '100vh', marginLeft: collapsed ? 85 : 190 }}
      >
        <Content style={{ color: 'black', margin: '0 16px' }}>
          {status === 'loading' ? <p>Loading feed...</p> : children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          @Copyright CyberLogitec 2023
        </Footer>
      </Layout>
    </Layout>
  );
}
