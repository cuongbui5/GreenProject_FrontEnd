"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import {useAuthStore} from "@/app/store/AuthStore";
import { Input, Button } from "antd";
import Link from "next/link";
import {LockOutlined, UserOutlined} from "@ant-design/icons";  // Import Ant Design components


export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login ,setPathname} = useAuthStore();


  const loginUser = async (event: any) => {
    event.preventDefault();
    await login({
      username: username,
      password: password,
    });
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  function loginWithGithub() {
    window.location.href = "http://localhost:7000/oauth2/authorization/github";
  }

  function loginWithGoogle() {
    window.location.href = "http://localhost:7000/oauth2/authorization/google";
  }

  return (
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <h1 className="text-custom-black-color font-semibold text-2xl mb-6 text-center">
          ĐĂNG NHẬP
        </h1>
        <form className="mt-6 w-full px-5 lg:px-0" onSubmit={loginUser}>
          <div className="mt-2">
            <Input
                type="text"
                placeholder="Tên đăng nhập"
                onChange={handleUsernameChange}
                required
                prefix={<UserOutlined className="mr-3 text-[18px]"/>} // Ant Design User icon
                style={{height: "48px"}} // Adjust height using style
                className="flex-1 py-[3px]" // Optional Tailwind styling
            />
          </div>

          <div className="mt-6">
            <Input.Password
                placeholder="Mật khẩu"
                onChange={handlePasswordChange}
                required
                prefix={<LockOutlined className="mr-3 text-[18px]"/>} // Ant Design Lock icon
                style={{height: "48px"}} // Adjust height using style
                className="flex-1 py-[3px]" // Optional Tailwind styling
            />
          </div>

          <p className="mt-5 text-xs text-brand-blue">
            <Link href="/auth/ForgotPasswordForm" className="cursor-pointer">
             Quên mật khẩu
            </Link>
          </p>

          <Button
              type="primary"
              htmlType="submit"
              className="mt-5 w-full bg-brand-primary text-white rounded-md"
              style={{height: "48px"}} // Adjust button height
              loading={loading} // Optionally, show loading indicator
          >
            Đăng nhập
          </Button>

          {error && (
              <p className="mt-4 text-red-600 bg-red-100 border border-red-300 rounded-md p-2 text-sm">
                {error}
              </p>
          )}
        </form>

        <div className="flex flex-col items-center w-full">
          <div className="mt-4 relative w-full mb-4">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-brand-gray"></div>
              <span className="mx-4 text-brand-gray whitespace-nowrap">HOẶC</span>
              <div className="flex-grow border-t border-brand-gray"></div>
            </div>
          </div>

          <div className="flex flex-row w-full max-w-md">
            <Button
                onClick={loginWithGoogle}
                className="flex-1 flex items-center justify-center border border-gray-300 bg-white text-black py-2 px-4 rounded-md mr-2"
                style={{height: "48px"}} // Adjust button height
            >
              <Image
                  className="rounded-xl mr-2"
                  width={30}
                  height={30}
                  src="/images/google.png"
                  alt="Google"
                  quality={75}
              />
              Google
            </Button>

            <Button
                onClick={loginWithGithub}
                className="flex-1 flex items-center justify-center border border-gray-300 bg-white text-black py-2 px-4 rounded-md ml-2"
                style={{height: "48px"}} // Adjust button height
            >
              <Image
                  className="rounded-xl mr-2"
                  width={30}
                  height={30}
                  src="/images/github.png"
                  alt="GitHub"
                  quality={75}
              />
              GitHub
            </Button>
          </div>
        </div>

        <p className="text-brand-gray text-center mt-5">
          Bạn chưa có tài khoản?
          <a
              onClick={() => setPathname("/register")}
              className="text-brand-primary ml-2 cursor-pointer"
          >
            Đăng ký
          </a>
        </p>
      </div>
  );
}
