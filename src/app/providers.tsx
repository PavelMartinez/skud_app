"use client"; 

import { ConfigProvider } from "antd";
import { Session } from "next-auth";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export function Providers({ children, session }: { children: React.ReactNode, session: Session }) {
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