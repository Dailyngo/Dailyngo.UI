"use client";

import FriendlyMessage from "@/components/FriendlyMessage";
import Image from "next/image";
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sol taraf - Görsel Bölümü */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 relative">
        <Image
          src="/images/auth_logo.jpg"
          alt="Register"
          fill
        />
      </div>

      {/* Sağ taraf - Register Formu */}
      {children}
      <FriendlyMessage />
    </div>)
}
