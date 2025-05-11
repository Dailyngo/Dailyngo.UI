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
  const [messageNotificationCount, setMessageNotificationCount] = useState(0);
  const {getAllNotifications,getAllUsersMessage} = useStore();
  const pathname = usePathname();

  useEffect(() => {
    const signalRHelper = new SignalRHelper("notification-hub");

    signalRHelper.startConnection();

    signalRHelper.on("ReceiveNotification",async (message: any) => {
      setNotificationCount(message);
    });
    signalRHelper.on("ReceiveMessageNotification", async (message: any) => {
      await fetchUsersMessage();
      setMessageNotificationCount(message);
    });
    return () => {
      signalRHelper.stopConnection();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if(pathname === "/notifications") {
        await getAllNotifications();
      };
    };

    fetchNotifications();
  }, [notificationCount]);

  const fetchUsersMessage = async () => {
    if(pathname === "/messages") {
      await getAllUsersMessage(1);
    };
  };

  useEffect(() => {
    fetchUsersMessage();
  }, [messageNotificationCount]);

  return (
		<div className="h-screen">
			{pathname !== "/messages" ? (
				<CustomNavbar notificationCount={notificationCount} messageNotificationCount={messageNotificationCount}>
					{children}
				</CustomNavbar>
			) : (
				children
			)}
			<FriendlyMessage />
		</div>
  );
}
