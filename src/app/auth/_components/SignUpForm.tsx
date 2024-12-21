"use client";

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/app/store/AuthStore";
import { Input, Button } from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";


export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register,setPathname } = useAuthStore((state) => state);

  const registerUser = async (event: any) => {
    event.preventDefault();
    await register({
      username: username,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };
  const handlePasswordConfirmChange = (event: any) => {
    setPasswordConfirm(event.target.value);
  };

  return (
      <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4">
        <h1 className="text-custom-black-color font-semibold text-2xl mb-6 text-center">
          ĐĂNG KÝ TÀI KHOẢN
        </h1>
        <form className="mt-4 w-full lg:px-0 px-4" onSubmit={registerUser}>
          <div className="mt-2">
            <Input
                type="text"
                placeholder="Họ và tên"
                onChange={handleUsernameChange}
                required
                prefix={<UserOutlined/>} // Ant Design icon
                style={{height: "48px"}} // Adjust height for consistency
            />
          </div>

          <div className="mt-6">
            <Input
                type="email"
                placeholder="Email"
                onChange={handleEmailChange}
                required
                prefix={<MailOutlined/>} // Ant Design icon
                style={{height: "48px"}} // Adjust height for consistency
            />
          </div>

          <div className="mt-6">
            <Input.Password
                placeholder="Mật khẩu"
                onChange={handlePasswordChange}
                required
                prefix={<LockOutlined/>} // Ant Design icon
                style={{height: "48px"}} // Adjust height for consistency
            />
          </div>

          <div className="mt-6">
            <Input.Password
                placeholder="Nhập lại mật khẩu"
                onChange={handlePasswordConfirmChange}
                required
                prefix={<LockOutlined/>} // Ant Design icon
                style={{height: "48px"}} // Adjust height for consistency
            />
          </div>

          <Button
              type="primary"
              htmlType="submit"
              className="mt-5 w-full bg-brand-primary text-white rounded-md"
              style={{height: "48px"}} // Adjust button height
              loading={loading}
          >
            Đăng ký
          </Button>

        </form>

        <p className="text-brand-gray text-center mt-5">
          Bạn đã có tài khoản?
          <a
              className="text-brand-primary ml-2 cursor-pointer"
              onClick={() => setPathname("/login")}
          >
            Đăng nhập
          </a>
        </p>
      </div>
  );
}
