"use client";
import React, { useState } from "react";
import { Input, Button } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons"; // Ant Design icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommonStore } from "@/app/store/CommonStore";
import { changePassword, ResetPasswordRequest } from "@/apis/modules/auth";
import Swal from "sweetalert2";

export default function NewPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { emailForgotPassword } = useCommonStore();

  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const resetPassword = async () => {
    try {
      const params: ResetPasswordRequest = {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };
      console.log(params);
      const res: any = await changePassword(params, emailForgotPassword);
      console.log(res);
      setLoading(false);
      await Swal.fire({
        title: "Đổi mật khẩu thành công",
        text: "",
        icon: "info",
        confirmButtonText: "OK",
      });
      window.location.replace("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitNewPassword = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }
    resetPassword();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-300">
      <h1 className="text-custom-black-color font-semibold text-2xl mb-6 text-center">
        ĐỔI MẬT KHẨU MỚI
      </h1>
      <form
        className="mt-6 w-full px-5 lg:px-0"
        onSubmit={handleSubmitNewPassword}
      >
        <div className="mt-2">
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            onChange={handleNewPasswordChange}
            required
            prefix={<LockOutlined className="mr-3 text-[18px]" />} // Ant Design Lock icon
            style={{ height: "48px" }} // Adjust height using style
            className="flex-1 py-[3px]" // Optional Tailwind styling
          />
        </div>

        <div className="mt-6">
          <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            onChange={handleConfirmPasswordChange}
            required
            prefix={<SafetyOutlined className="mr-3 text-[18px]" />} // Ant Design Safety icon
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
          Lưu mật khẩu mới
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
