"use client"
import Link from "next/link";
import Image from "next/image";

import {BellOutlined, LogoutOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
import {Dropdown, Menu} from "antd";
import {useAuthStore} from "@/app/store/AuthStore";
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {useCartStore} from "@/app/store/CartStore";

export default function Header() {
  const {logout}=useAuthStore(state => state);
  const [notifications, setNotifications] = useState<string[]>([]);
  const {cartItems,getAllCartItems}=useCartStore(state => state)
  useEffect(() => {
    if(cartItems.length==0){
      getAllCartItems();
    }
  }, []);
  useEffect(() => {
    const userId=localStorage.getItem("userId");
    console.log(userId)

    const socket=new SockJS("http:/localhost:7000/ws");
    const client=Stomp.over(socket);
    client.connect({},()=>{
      client.subscribe(`/topic/order-status/${userId}`,message => {
        const body = message.body;
        console.log(body);
        setNotifications(prev => [...prev, body]);
      })
    })



    return ()=>{
      if(client.connected){
        client.disconnect(()=>{})
      }


    }



  }, []);

  async function handleLogout() {
    await logout();
  }

  const items:any = [
    {
      key: 'logout',
      label: <span  onClick={handleLogout}><LogoutOutlined /> Logout</span>, // Kết hợp icon và text trong một phần tử <span>
    },
  ];
  const notificationMenu = (
      <Menu>
        {notifications.length > 0 ? (
            notifications.map((notif, index) => (
                <Menu.Item key={index}>
                  {notif}
                </Menu.Item>
            ))
        ) : (
            <Menu.Item key="no-notifications">
              Không có thông báo
            </Menu.Item>
        )}
      </Menu>
  );

  return (
    <header className="bg-white shadow-md px-2">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Image
            src="/client/components/header/logo.jpeg"
            alt="Logo"
            width={180}
            height={100}
            className="h-full object-contain cursor-pointer"
        />
        <nav className="flex justify-center items-center">
          <ul className="flex space-x-4 m-0 p-0">
            <li>
              <Link
                  href="/home"
                  className="hover:text-gray-600 font-[600] px-4"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                  href="/about"
                  className="hover:text-gray-600 font-[600] px-4"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                  href="/products"
                  className="hover:text-gray-600 font-[600] px-4"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                  href="/contact"
                  className="hover:text-gray-600 font-[600] px-4"
              >
                Dịch vụ
              </Link>
            </li>
            <li>
              <Link
                  href="/contact"
                  className="hover:text-gray-600 font-[600] px-4"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex justify-between px-4">
          <SearchOutlined className="text-xl mr-6 cursor-pointer"/>

          <Link href="/cart">
            <div className="relative cursor-pointer">
              <ShoppingCartOutlined className="text-xl"/>
              <span className="absolute top-[-20px] right-[-20px] -translate-x-1/2 translate-y-1/2 bg-brand-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {cartItems.length}
      </span>
            </div>
          </Link>
          <Dropdown overlay={notificationMenu} trigger={['hover']}>
            <div className="relative cursor-pointer ml-6">
              <BellOutlined className="text-xl" />
              {notifications.length > 0 && (
                  <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          </Dropdown>
          <Dropdown menu={{items}} trigger={['hover']}>

          <Link href="/profile/account">
            <UserOutlined className="text-xl ml-6 cursor-pointer"/>
          </Link>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
