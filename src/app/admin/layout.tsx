"use client";

import { Roboto } from "next/font/google";
import React, { useEffect, useState, useCallback } from "react";
import {
  AppstoreOutlined,
  HomeOutlined,
  TagOutlined,
  SettingOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  GiftOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic"; // Dynamic import

const { Content, Footer, Sider } = Layout;

const roboto = Roboto({
  subsets: ["vietnamese"],
  weight: ["400", "700"],
  display: "swap",
});

type MenuItem = Required<MenuProps>["items"][number];

// Hàm tạo item menu
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// Dynamic import cho từng page component
const DynamicDashboard = dynamic(() => import("../admin/page"));
const DynamicCategories = dynamic(() => import("../admin/categories/page"));
const DynamicProducts = dynamic(() => import("../admin/products/page"));
const DynamicOrders = dynamic(() => import("../admin/orders/page"));
const DynamicVouchers = dynamic(() => import("../admin/vouchers/page"));
const DynamicVariations = dynamic(() => import("../admin/variations/page"));
const DynamicOptions = dynamic(() => import("../admin/options/page"));
const DynamicProductItems = dynamic(() => import("../admin/productItems/page"));

export default function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const router = useRouter();
  const pathname = usePathname();

  const menuMapping: { [key: string]: string } = {
    "/admin": "1",
    "/admin/categories": "2",
    "/admin/products": "3",
    "/admin/orders": "4",
    "/admin/vouchers": "5",
    "/admin/variations": "6",
    "/admin/options": "7",
    "/admin/productItems": "8",
  };

  useEffect(() => {
    setSelectedKey(menuMapping[pathname] || "1");
  }, [pathname, menuMapping]);

  const handleMenuClick: MenuProps["onClick"] = useCallback(
    (e: any) => {
      const { key } = e;
      setSelectedKey(key);

      switch (key) {
        case "1":
          router.replace("/admin");
          break;
        case "2":
          router.replace("/admin/categories");
          break;
        case "3":
          router.replace("/admin/products");
          break;
        case "4":
          router.replace("/admin/orders");
          break;
        case "5":
          router.replace("/admin/vouchers");
          break;
        case "6":
          router.replace("/admin/variations");
          break;
        case "7":
          router.replace("/admin/options");
          break;
        case "8":
          router.replace("/admin/productItems");
          break;
        default:
          break;
      }
    },
    [router]
  );

  const items: MenuItem[] = [
    getItem("Trang chủ", "1", <HomeOutlined />),
    getItem("Quản lý danh mục", "2", <AppstoreOutlined />),
    getItem("Quản lý biến thể", "6", <TagOutlined />),
    getItem("Quản lý tùy chọn biến thể", "7", <SettingOutlined />),
    getItem("Quản lý sản phẩm", "3", <ShoppingOutlined />),
    getItem("Quản lý chi tiết sản phẩm", "8", <FileTextOutlined />),
    getItem("Quản lý đơn hàng", "4", <SolutionOutlined />),
    getItem("Quản lý voucher", "5", <GiftOutlined />),
  ];

  return (
    <main className={roboto.className}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            selectedKeys={[selectedKey]}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: "16px" }}>
            {selectedKey === "1" && <DynamicDashboard />}
            {selectedKey === "2" && <DynamicCategories />}
            {selectedKey === "3" && <DynamicProducts />}
            {selectedKey === "4" && <DynamicOrders />}
            {selectedKey === "5" && <DynamicVouchers />}
            {selectedKey === "6" && <DynamicVariations />}
            {selectedKey === "7" && <DynamicOptions />}
            {selectedKey === "8" && <DynamicProductItems />}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Admin Dashboard ©2024 Created by You
          </Footer>
        </Layout>
      </Layout>
    </main>
  );
}
