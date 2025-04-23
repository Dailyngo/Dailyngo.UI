const Provider = dynamic(() => import("@/components/auth/authProvider"));

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DM_Sans } from "next/font/google";
import "./global.css";
import "./satoshi.css";
import { ConfigProvider } from "antd";
import trTr from "antd/lib/locale/tr_TR";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DailyNgo",
  description: "dailyngo.com",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`bg-gray-100 ${inter.className}`}
      >
           <ConfigProvider
locale={trTr}

          >
        <Provider>
          {children}  
        </Provider>
        </ConfigProvider> 
      </body>
    </html>
  );
}
