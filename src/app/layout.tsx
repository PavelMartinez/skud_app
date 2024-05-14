// Импортируйте необходимые типы и модули
import './globals.css'
import { Providers } from "./providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// Определите и экспортируйте компонент RootLayout
export default function RootLayout({
  children,
  session, // Добавляем session в параметры
}: Readonly<{
  children: React.ReactNode;
  session?: any;
}>) {
  return (
    <html lang="en">
      <Providers session={session}>
        <body>
          <Providers session={session}>
            <AntdRegistry>{children}</AntdRegistry>
          </Providers>
        </body>
      </Providers>
    </html>
  );
}
