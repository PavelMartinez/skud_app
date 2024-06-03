'use client';

import React, { useState } from 'react';
import {
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Watermark, theme } from 'antd';
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react';

const { Content, Footer } = Layout;

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
  const handleSignOut = async () => {
	  router.push("/api/auth/signout")
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
			<Content style={{ margin: '24px 50px 0', display: "flex", justifyContent: "center", alignItems: "center" }}>
					<div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>{children}</div>
			</Content>
      <Footer style={{ textAlign: 'center' }}>{session.data?.user.surname} {session.data?.user.name} {session.data?.user.lastname} <Button onClick={handleSignOut} type="link">Выйти</Button></Footer>
    </Layout>
  )
};

export default DashboardLayout;