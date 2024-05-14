"use client"; 

import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";

export function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
	return (
		<SessionProvider session={session}>
			<ConfigProvider
				theme={{
					token: {
						// Seed Token
						colorPrimary: '#00b96b',
						borderRadius: 2,
					},
				}}
			>
				{children}
			</ConfigProvider>
		</SessionProvider>
	)
}