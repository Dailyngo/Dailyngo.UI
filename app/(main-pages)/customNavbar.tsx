import { Icon } from "@iconify/react/dist/iconify.js";
import { Menu, Dropdown, Button, Badge, Tooltip } from "antd";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from '../../store';
import {
  Home,
  HomeFill,
  Search,
  SearchFill,
  Notification,
  NotificationFill,
  Message,
  MessageFill,
  Admin
} from "@/components/svgicon";
import { useEffect, useState } from "react";
import { getTokenInfos } from "@/utils/helpers";

type Params = {
  notificationCount: number;
  children: React.ReactNode;
};

const CustomNavbar = ({ notificationCount, children }: Params) => {
  const [current, setCurrent] = useState('1');
  const pathname = usePathname();
  const router = useRouter();
  const [userRoles, setUserRoles] = useState('');
  const { logout } = useStore();

  // Menü öğeleri
  const menuItems = [
    {
      key: '1',
      label: 'Home',
      path: '/',
      icon: current === '1' ? <HomeFill /> : <Home />,
    },
    {
      key: '2',
      label: 'Search',
      path: '/search',
      icon: current === '2' ? <SearchFill /> : <Search />,
    },
    {
      key: '3',
      label: 'Notifications',
      path: '/notifications',
      icon: (
        <Badge count={notificationCount}>
          {current === '3' ? <NotificationFill /> : <Notification />}
        </Badge>
      ),
    },
    {
      key: '4',
      label: 'Messages',
      path: '/messages',
      icon: current === '4' ? <MessageFill /> : <Message />,
    },
  ];

  useEffect(() => {
    const activeItem = menuItems.find(item => item.path === pathname);
    if (activeItem) setCurrent(activeItem.key);
    else setCurrent('0');
  }, [pathname]);

  useEffect(() => {
    const tokenInfo = getTokenInfos();
    setUserRoles(tokenInfo.roles);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navigateToAdmin = () => {
    router.push('/admin');
  };

  const profileItems = [
    {
      key: '1',
      label: 'Profile',
      onClick: () => window.location.href = '/profile',
    },
    {
      key: '2',
      label: 'Logout',
      onClick: handleLogout,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Üst Kısım - Logo ve Profil */}
      <nav className="w-full bg-white shadow-md px-4 md:px-6 py-3 flex items-center justify-between border-b border-gray-200 fixed top-0 z-50">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Paneli Butonu - Sadece admin kullanıcılara göster */}
          {userRoles.toLowerCase().includes("superadmin") && (
            <Tooltip title="Admin Panel">
              <Button
                type="primary" 
                shape="round"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-md"
                onClick={navigateToAdmin}
                icon={<Admin />}
                size="middle"
              >
                <span className="ml-1 text-xs sm:text-sm">Admin</span>
              </Button>
            </Tooltip>
          )}
          
          <Dropdown
            menu={{ items: profileItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              className="flex items-center hover:bg-gray-100 rounded-full p-2"
            >
              <Icon
                icon="ant-design:user-outlined"
                width="28"
                height="28"
                className="text-gray-600"
              />
            </Button>
          </Dropdown>
        </div>
      </nav>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 mt-16 mb-16 overflow-y-auto p-4 md:p-6">
        {children}
      </main>

      {/* Alt Navigasyon Çubuğu */}
      <nav className="w-full bg-white border-t border-gray-200 fixed bottom-0 z-50 py-3">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className="flex items-center justify-center p-2 hover:text-blue-600 transition-colors"
                onClick={() => setCurrent(item.key)}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CustomNavbar;