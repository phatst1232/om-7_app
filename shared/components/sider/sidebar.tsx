'use client';
import React from 'react';
import {
  SlidersOutlined,
  UserOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';
import {
  DASHBOARD_PATH,
  DASHBOARD_USER_PATH,
  DASHBOARD_ROLE_PATH,
  DASHBOARD_PERMISSION_PATH,
} from '@/shared/common/app-route';
import { signOut } from 'next-auth/react';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Dashboard', 'sub1', <SlidersOutlined />, [
    getItem(
      'User Management',
      'g1',
      null,
      [
        getItem('User Table', '1'),
        // getItem('Update', '2'),
        // getItem('Activate Job', '3'),
      ],
      'group'
    ),
    getItem(
      'Permission Grant',
      'g2',
      null,
      [getItem('User Role', '4'), getItem('User Permission', '5')],
      'group'
    ),
  ]),

  getItem('Admin', 'sub2', <UserOutlined />, [
    getItem('Profile', '6'),
    getItem('Test Space', '8'),
    getItem('Log out', '7', <RollbackOutlined />),
  ]),
];

const SideBarMenu: React.FC = () => {
  const router = useRouter();

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    switch (e.key) {
      case '1':
        router.push(DASHBOARD_USER_PATH);
        break;
      case '4':
        router.push(DASHBOARD_ROLE_PATH);
        break;
      case '5':
        router.push(DASHBOARD_PERMISSION_PATH);
        break;
      case '7':
        signOut();
        break;
      case '8':
        router.push(DASHBOARD_PATH);
        break;
      default:
        router.push(DASHBOARD_PATH);
    }
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Menu
      onClick={onClick}
      theme='dark'
      style={{ animation: 'backwards', backgroundColor: '#202540' }}
      defaultSelectedKeys={['8']}
      defaultOpenKeys={['sub1', 'sub2']}
      mode='inline'
      items={items}
    />
  );
};

export default SideBarMenu;
