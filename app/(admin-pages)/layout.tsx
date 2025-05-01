"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

const { Sider, Content } = Layout;

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Ekran boyutunu kontrol et
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    {
      key: "/admin",
      icon: <Icon icon="material-symbols:dashboard-outline" width="20" height="20" />,
      label: "Dashboard",
    },
    {
      key: "/admin/reports",
      icon: <Icon icon="mingcute:warning-line" width="20" height="20" />,
      label: "Raporlamalar",
    },
    // {
    //   key: "/admin/blacklist",
    //   icon: <Icon icon="ci:stop-sign" width="20" height="20" />,
    //   label: "Kara Liste",
    // }
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="fixed left-0 top-0 bottom-0 z-10 bg-gray-900 shadow-xl h-screen"
        trigger={null}
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div className="flex items-center justify-between p-4 h-16 bg-gray-800 border-b border-gray-700">
          {!collapsed && (
            <Link href="/admin" className="flex items-center">
              <span className="text-gray-100 font-bold text-xl ml-1">
                Admin Panel
              </span>
            </Link>
          )}
          {!isMobile && (
            <Button
              type="text"
              icon={
                collapsed ? (
                  <Icon icon="line-md:close-to-menu-alt-transition" width="24" height="24" />
                ) : (
                  <Icon icon="line-md:menu-to-close-alt-transition" width="24" height="24" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center ml-auto text-gray-100"
            />
          )}
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            className="border-r-0"
            style={{
              backgroundColor: 'transparent',
              borderRight: 'none'
            }}
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                className={
                  pathname === item.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }
              >
                {!collapsed && (
                  <Link href={item.key} className={pathname === item.key ? "font-medium" : ""}>
                    {item.label}
                  </Link>
                )}
                {collapsed && (
                  <Link href={item.key} className="sr-only">
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
            
            <div className="border-t border-gray-700 my-4"></div>
            
            <Menu.Item
              key="logout"
              className="text-gray-300 mt-auto"
              onClick={() => console.log("Çıkış yapıldı")}
            >
              {!collapsed ? <span>Çıkış Yap</span> : <Icon icon="material-symbols:logout-rounded" width="24" height="24" />}
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      {/* Mobil Menu Toggle */}
      {isMobile && (
        <div
          className={`fixed z-20 top-4 ${collapsed ? 'left-4' : 'left-[240px]'} transition-all duration-300`}
        >
          <Button
            type="primary"
            shape="round"
            icon={
              collapsed ? (
                <Icon icon="line-md:close-to-menu-alt-transition" width="24" height="24" />
              ) : (
                <Icon icon="line-md:menu-to-close-alt-transition" width="24" height="24" />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center shadow-lg bg-blue-600 border-blue-700"
          />
        </div>
      )}
      
      <Layout
        className="transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 240) }}
      >
        <Content className="p-6 bg-gray-100 min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;