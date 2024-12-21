"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input, Button } from "antd";
import Link from "next/link";
import { MailOutlined } from "@ant-design/icons"; // Ant Design icon
import { verityEmail } from "@/apis/modules/auth";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import OTPForm from "@/app/auth/OTPForm/page";
import { useCommonStore } from "@/app/store/CommonStore";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { setEmailForgotPassword } = useCommonStore();

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    const res: any = await verityEmail(email);
    setEmailForgotPassword(email);
    setLoading(false);
    await Swal.fire({
      title: "OTP đã được gửi qua email",
      text: "",
      icon: "info",
      confirmButtonText: "OK",
    });
    router.push("/auth/OTPForm");
  };

  const handleResetPassword = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    forgotPassword(email);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-300">
      <h1 className="text-custom-black-color font-semibold text-2xl mb-6 text-center">
        QUÊN MẬT KHẨU
      </h1>
      <form className="mt-6 w-full px-5 lg:px-0" onSubmit={handleResetPassword}>
        <div className="mt-2">
          <Input
            type="email"
            placeholder="Nhập email của bạn"
            onChange={handleEmailChange}
            required
            prefix={<MailOutlined className="mr-3 text-[18px]" />} // Ant Design Mail icon
            style={{ height: "48px" }} // Adjust height using style
            className="flex-1 py-[3px]" // Optional Tailwind styling
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="mt-5 w-full bg-brand-primary text-white rounded-md"
          style={{ height: "48px" }} // Adjust button height
          loading={loading} // Optionally, show loading indicator
        >
          Gửi email khôi phục mật khẩu
        </Button>

        {error && (
          <p className="mt-4 text-red-600 bg-red-100 border border-red-300 rounded-md p-2 text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 text-green-600 bg-green-100 border border-green-300 rounded-md p-2 text-sm">
            {success}
          </p>
        )}
      </form>

      <div className="flex flex-col items-center w-full mt-6">
        <p className="text-xs text-brand-blue">
          <Link href="/auth" className="cursor-pointer">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
