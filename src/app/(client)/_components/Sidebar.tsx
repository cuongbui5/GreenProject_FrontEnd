"use client";
import { getUserInfo } from "@/apis/modules/user";
import { useUserStore } from "@/app/store/UserStore";
import {
  UserOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  LockOutlined,
  EnvironmentOutlined,
  WalletOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

export default function Sidebar() {
  // const [user, setUser] = useState<any>(null);
  const { user, setUser } = useUserStore((state) => state);

  const getUser = async () => {
    const res: any = await getUserInfo();
    // console.log(res);
    if (res.code == 200) {
      setUser(res.data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
      <div className="w-1/5 bg-gray-200 p-5 shadow-lg h-[600px] mr-5">
        <div className="flex items-center mb-6">
          <img
              src={user?.imgUrl || "/client/user/default_user.jpg"}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover"
          />
          <span className="ml-4 font-bold text-gray-700">{user?.username} (point:{user?.points})</span>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center cursor-pointer hover:text-brand-primary">
            <Link href="/profile/account" className="flex items-center">
              <UserOutlined className="mr-3 text-gray-500"/>
              Tài khoản của tôi
            </Link>
          </li>
          <li className="flex items-center cursor-pointer hover:text-brand-primary">
            <Link href="/profile/orders" className="flex items-center">
              <ShoppingCartOutlined className="mr-3 text-gray-500"/>
              Đơn mua
            </Link>
          </li>
          <li className="flex items-center cursor-pointer hover:text-brand-primary">
            <Link href="/profile/vouchers" className="flex items-center">
              <GiftOutlined className="mr-3 text-gray-500"/>
              Kho voucher
            </Link>
          </li>
          <li className="flex items-center cursor-pointer hover:text-brand-primary">
            <Link href="/profile/change-password" className="flex items-center">
              <LockOutlined className="mr-3 text-gray-500"/>
              Đổi mật khẩu
            </Link>
          </li>
          <li className="flex items-center cursor-pointer hover:text-brand-primary">
            <Link href="/profile/address" className="flex items-center">
              <EnvironmentOutlined className="mr-3 text-gray-500"/>
              Địa chỉ
            </Link>
          </li>
          <li className="flex items-center cursor-pointer hover:text-brand-primary">
            <Link href="/profile/payment_account" className="flex items-center">
              <WalletOutlined  className="mr-3 text-gray-500"/>
              Tài khoản thanh toán
            </Link>
          </li>
        </ul>
      </div>
  );
}
