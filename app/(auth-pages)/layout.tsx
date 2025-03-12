
import Image from "next/image";
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sol taraf - Görsel Bölümü */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative">
        <Image
          src="/images/_logo.png"
          alt="Register"
          fill
        />
        <div className="absolute inset-0 bg-blue-600/30" />
      </div>

      {/* Sağ taraf - Register Formu */}
      {children}
    </div>)
}
