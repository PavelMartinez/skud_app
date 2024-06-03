'use client';

import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Watermark, theme } from 'antd';
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Главная', '/dashboard', <UserOutlined />),
  getItem('Сотрудники', '/dashboard/employee', <UserOutlined />),
  getItem('Гости', '/dashboard/guest', <TeamOutlined />)
];

interface Props {
    children: React.ReactNode
}


const DashboardLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter()
  const session = useSession()

  const handleMenuClick = (item: MenuItem) => {
    router.push(`${item?.key}`)
  }
  const handleSignOut = async () => {
	router.push("/api/auth/signout")
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} breakpoint="lg" collapsedWidth="0">
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick}/>
      </Sider>
      <Layout>
		<Watermark content="SKUD">
			<Content style={{ margin: '24px 50px 0' }}>
					<div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>{children}</div>
			</Content>
		</Watermark>
        <Footer style={{ textAlign: 'center' }}>{session.data?.user.surname} {session.data?.user.name} {session.data?.user.lastname} <Button onClick={handleSignOut} type="link">Выйти</Button></Footer>
      </Layout>
    </Layout>
  )
};

export default DashboardLayout;