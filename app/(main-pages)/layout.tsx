"use client";
// import Sidebar from "@/app/(mainPages)";
// import Loader from "@/components/common/Loader";
// import Header from "@/components/Header";
import FriendlyMessage from "@/components/FriendlyMessage";
import { useStore } from "@/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import "../global.css";
import "../satoshi.css";
import CustomNavbar from "@/app/(main-pages)/customNavbar";

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

  //  useEffect(() => {
  //    setTimeout(() => setLoading(false), 1000);
  //  }, []);

  return (
		<div className="h-screen bg-white">
      <CustomNavbar />
			{children}
			<FriendlyMessage />
		</div>
  );
}
