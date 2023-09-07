"use client";

import { useEffect, useState } from "react";
import { Layout, Menu, MenuProps, theme } from "antd";
import SideBarMenu from "@/shared/components/sider/sidebar";
import StyledComponentsRegistry from "@/lib/AntdRegistry";

const { Header, Content, Sider, Footer } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          animation: "infinite",
          display: "inline-block",
        }}
        collapsible
        collapsed={collapsed}
        collapsedWidth="80"
        onCollapse={(value) => setCollapsed(value)}
      >
        <SideBarMenu></SideBarMenu>
      </Sider>
      <Layout
        className="site-layout"
        style={{ minHeight: "100vh", marginLeft: collapsed ? 85 : 190 }}
      >
        {/* <Header
          style={{
            textAlign: "center",
            margin: "16px 16px",
            background: colorBgContainer,
          }}
        >
          Header
        </Header> */}
        <Content style={{ color: "black", margin: "0 16px" }}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          @Copyright CyberLogitec 2023
        </Footer>
      </Layout>
    </Layout>
  );
}
