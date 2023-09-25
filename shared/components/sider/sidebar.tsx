'use client';
import React from 'react';
import {
  SlidersOutlined,
  UserOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  DASHBOARD_PATH,
  DASHBOARD_USER_PATH,
  DASHBOARD_ROLE_PATH,
  DASHBOARD_PERMISSION_PATH,
  PROFILE_PATH,
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
      [getItem('User Table', DASHBOARD_USER_PATH)],
      'group'
    ),
    getItem(
      'Permission Grant',
      'g2',
      null,
      [
        getItem('User Role', DASHBOARD_ROLE_PATH),
        getItem('User Permission', DASHBOARD_PERMISSION_PATH),
      ],
      'group'
    ),
  ]),

  getItem('Admin', 'sub2', <UserOutlined />, [
    getItem('Profile', PROFILE_PATH),
    getItem('Test Space', DASHBOARD_PATH),
    getItem('Log out', 'sign-out', <RollbackOutlined />),
  ]),
];

const SideBarMenu: React.FC = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const onClick: MenuProps['onClick'] = (item) => {
    console.log('click ', item);
    if (item.key) {
      if (item.key === 'sign-out') {
        signOut();
        return;
      }
      router.push(item.key);
      return;
    }
    router.push(DASHBOARD_USER_PATH);
  };

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  return (
    <Menu
      onClick={onClick}
      theme='dark'
      style={{ animation: 'backwards', backgroundColor: '#202540' }}
      defaultSelectedKeys={[currentPath]}
      defaultOpenKeys={['sub1', 'sub2']}
      mode='inline'
      items={items}
    />
  );
};

export default SideBarMenu;
