"use client";

import TableAdminUser from "@/shared/components/table/admin-table--user";
import CustomAdminUserTable from "@/shared/components/table/custom-admin-user-table";
import FullTableTest from "@/shared/components/table/test-full-table";
import FullTableTestt from "@/shared/components/table/test-full-table";
import { Layout, theme } from "antd";
import Image from "next/image";
import React from "react";

const { Header, Content, Sider, Footer } = Layout;

export default function DashboardHome() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div
      className="w_content"
      style={{ padding: 24, background: colorBgContainer }}
    >
      {/* <h1 className='table-title'>Custom Admin User table</h1> */}
      <CustomAdminUserTable />
      <FullTableTest />
      <TableAdminUser />
    </div>
  );
}
