"use client";

import FriendlyMessage from "@/components/FriendlyMessage";
import { useStore } from "@/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../global.css";
import "../satoshi.css";
import CustomNavbar from "@/app/(main-pages)/customNavbar";
import { SignalRHelper } from "@/lib/utils"; // Import SignalRHelper

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationCount, setNotificationCount] = useState(0);

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

  return (
    <div className="h-screen  bg-gray-100">
      <CustomNavbar notificationCount={notificationCount}/>
      {children}
      <FriendlyMessage />
    </div>
  );
}
