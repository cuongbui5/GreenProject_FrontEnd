"use client"

import { Roboto } from "next/font/google";
import React, {useEffect, useState} from 'react';
import {
    AppstoreOutlined,
    DesktopOutlined,
    FileOutlined, FileTextOutlined, GiftOutlined, HomeOutlined,
    PieChartOutlined, SettingOutlined, ShoppingOutlined, SolutionOutlined, TagOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {usePathname, useRouter} from "next/navigation";




const roboto = Roboto({ subsets: ["vietnamese"], weight: ["400", "700"] });




export default function ProductPageLayout({
                                  children,
                              }: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <main className={roboto.className}>
            {children}


        </main>

    );
}
