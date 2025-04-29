"use client";

import React, { useState } from "react";
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
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/admin",
      icon: <Icon icon="material-symbols:dashboard-outline" className="text-gray-400" width="20" height="20" />,
      label: "Dashboard",
    },
    {
      key: "/admin/reports",
      icon: <Icon icon="mingcute:warning-line" className="text-gray-400" width="20" height="20" />,
      label: "Raporlamalar",
    },
    // {
    //   key: "/admin/blacklist",
    //   icon: <Icon icon="ci:stop-sign" className="text-gray-400" width="20" height="20" />,
    //   label: "Kara Liste",
    // }
  ];

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sider
        width={collapsed ? 80 : "33%"}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="bg-gray-700 h-screen fixed left-0 top-0 bottom-0 shadow-lg"
        trigger={null}
      >
        <div className="flex items-center justify-between p-4 h-16 bg-gray-800 border-b border-gray-700">
          {!collapsed && (
            <span className="text-gray-100 font-bold text-xl">
              Admin Panel
            </span>
          )}
          <Button
            type="text"
            icon={
              collapsed ? (
                <Icon
                  icon="heroicons:menu-alt-2"
                  className="text-gray-300 hover:text-white"
                  width="20"
                  height="20"
                />
              ) : (
                <Icon
                  icon="heroicons:menu-alt-3"
                  className="text-gray-300 hover:text-white"
                  width="20"
                  height="20"
                />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            className="bg-transparent hover:bg-gray-700 flex items-center justify-center"
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          className="mt-2 bg-gray-900 border-r-0"
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
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }
            >
              <Link href={item.key} className={pathname === item.key ? "font-medium" : ""}>
                {item.label}
              </Link>
            </Menu.Item>
          ))}
          
          <div className="border-t border-gray-700 my-4"></div>
          
          <Menu.Item
            key="logout"
            icon={<Icon icon="heroicons:logout" className="text-gray-400" width="20" height="20" />}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => console.log("Çıkış yapıldı")}
          >
            Çıkış Yap
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Layout
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : "33.333%" }}
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