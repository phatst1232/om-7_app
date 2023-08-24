"use client"

import { Layout } from 'antd'

const { Content, Footer } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Layout
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "98vh",
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        @Copyright CyberLogitec 2023
      </Footer>
    </Layout>
  );
}
