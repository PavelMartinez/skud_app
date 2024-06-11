// Импортируйте необходимые типы и модули
import { NextAuthResult, Session } from 'next-auth';
import './globals.css'
import { Providers } from "./providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { auth } from '@/auth';

// Определите и экспортируйте компонент RootLayout
export default function RootLayout({
  children,
  session, // Добавляем session в параметры
}: Readonly<{
  children: React.ReactNode;
  session?: Session;
}>) {
  return (
    <html lang="en">
        <body>
          <Providers session={session}>
            <AntdRegistry>{children}</AntdRegistry>
          </Providers>
        </body>
    </html>
  );
}
