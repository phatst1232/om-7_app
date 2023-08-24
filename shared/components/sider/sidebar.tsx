"use client"
import React from 'react';
import { SlidersOutlined, UserOutlined, RollbackOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, theme } from 'antd';
import { useRouter } from 'next/navigation'
import { LOGIN_PATH, USER_TABLE_PATH } from '@/shared/common/app-route';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Dashboard", "sub1", <SlidersOutlined />, [
    getItem(
      "User Management",
      "g1",
      null,
      [getItem("User Table", "1"), getItem("Update", "2"), getItem("Activate Job", "3")],
      "group"
    ),
    getItem(
      "Permission Grant",
      "g2",
      null,
      [getItem("User Role", "4"), getItem("User permission", "5")],
      "group"
    ),
  ]),

  getItem("Admin", "sub2", <UserOutlined />, [
    getItem("Profile", "6"),
    getItem("Log out", "7", <RollbackOutlined />),
    // getItem("Submenu", "sub3", null, [
    //   getItem("Option 7", "8"),
    //   getItem("Option 8", "9"),
    // ]),
  ]),

  // { type: 'divider' },

  // getItem('Navigation Three', 'sub4', <SettingOutlined />, [
  //   getItem('Option 9', '9'),
  //   getItem('Option 10', '10'),
  //   getItem('Option 11', '11'),
  //   getItem('Option 12', '12'),
  // ]),

  // getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
];

const SideBarMenu: React.FC = () => {
  const router = useRouter()

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    switch (e.key) {
      case '1':
        router.push(USER_TABLE_PATH)
        break;
      case '7': 
        localStorage.removeItem('token');
        router.push(LOGIN_PATH);
        break;
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
      defaultSelectedKeys={['1']}
      // defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};

export default SideBarMenu;