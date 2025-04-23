"use client";

import FriendlyMessage from "@/components/FriendlyMessage";
import { useStore } from "@/store";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../global.css";
import "../satoshi.css";
import CustomNavbar from "@/app/(main-pages)/customNavbar";
import { SignalRHelper } from "@/lib/utils"; // Import SignalRHelper
import path from "path";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationCount, setNotificationCount] = useState(0);
  const {getAllNotifications} = useStore();
  const pathname = usePathname();

  useEffect(() => {
    const signalRHelper = new SignalRHelper("notification-hub");

    signalRHelper.startConnection();

    signalRHelper.on("ReceiveNotification", (message: any) => {
      setNotificationCount(message);
    });

    // Cleanup bağlantıyı durdur
    return () => {
      signalRHelper.stopConnection();
    };
  }, []);

  useEffect(() => {
    if(pathname === "/notifications") {
      getAllNotifications();
    };
  }, [notificationCount]);

  return (
    <div className="h-screen">
      <CustomNavbar notificationCount={notificationCount}>
        {children}
      </CustomNavbar>
      <FriendlyMessage />
    </div>
  );
}
