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
    icon: "/logo.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DailyNgo"
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
        <meta name="application-name" content="DailyNgo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DailyNgo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
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
