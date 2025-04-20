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
  const storedSidebarExpanded =
    typeof window !== "undefined"
      ? localStorage.getItem("sidebar-expanded")
      : true;
  const [sidebarOpen, setSidebarOpen] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();
  const { addMessageForUser, isEmailVerified, isRegistered } = useStore();

  const isAuth =
    typeof window !== "undefined" && localStorage.getItem("isAuth");

  useEffect(() => {
    // SignalR bağlantısını başlat
    const signalRHelper = new SignalRHelper("notification-hub");

    signalRHelper.startConnection();

    signalRHelper.on("ReceiveNotification", (message: any) => {
      console.log("Mesaj alındı:", message);
    });

    // Cleanup bağlantıyı durdur
    return () => {
      signalRHelper.stopConnection();
    };
  }, []);

  return (
    <div className="h-screen bg-white">
      <CustomNavbar />
      {children}
      <FriendlyMessage />
    </div>
  );
}
