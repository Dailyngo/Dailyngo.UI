"use client";

import FriendlyMessage from "@/components/FriendlyMessage";
import Image from "next/image";
import { useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  // PWA meta etiketlerini client tarafında eklemek için useEffect kullanıyoruz
  useEffect(() => {
    // Manifest bağlantısını ekle
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }
    
    // Apple touch icon ekle
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = '/images/logo.png';
      document.head.appendChild(appleTouchIcon);
    }
  }, []);
  
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
