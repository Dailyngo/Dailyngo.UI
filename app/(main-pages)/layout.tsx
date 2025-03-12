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
    <div className="dark:bg-boxdark-2 dark:text-bodydark">

      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1">
            {/* <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10"> */}
            <div className="mx-auto max-w-screen-2xl min-w-full">

              {children}
              <FriendlyMessage />
            </div>
          </main>

        </div>
      </div>

    </div>
  );
}
