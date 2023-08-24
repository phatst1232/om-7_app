"use client"

import { Layout, theme } from 'antd'
import Image from 'next/image'
import React from 'react';

const { Header, Content, Sider, Footer } = Layout;


export default function DashboardHome() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
      <p>long content</p>
      {
        // indicates very long content
        Array.from({ length: 100 }, (_, index) => (
          <React.Fragment key={index}>
            {index % 20 === 0 && index ? 'more' : '...'}
            <br />
          </React.Fragment>
        ))
      }
    </div>
  )
}
