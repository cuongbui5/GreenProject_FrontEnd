"use client";
import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/apis/modules/auth";
import Swal from "sweetalert2";
import { useCommonStore } from "@/app/store/CommonStore";

export default function OTPForm() {
  const [otp, setOtp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(70); // Thời gian đếm ngược (70 giây)
  const router = useRouter();
  const { emailForgotPassword } = useCommonStore();

  const handleOtpChange = (event: any) => {
    setOtp(event.target.value);
  };

  const sendOTP = async (otp: number) => {
    setLoading(true);
    try {
      const res: any = await verifyOtp(emailForgotPassword, otp);
      setLoading(false);
      setSuccess("Xác minh thành công!");
      router.push("/auth/NewPasswordForm");
    } catch (err: any) {
      setLoading(false);
      setError("Mã OTP không chính xác hoặc đã hết hạn.");
    }
  };

  const handleVerifyOTP = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    sendOTP(otp);
  };

  // Quản lý thời gian hết hạn
  useEffect(() => {
    if (timeLeft <= 0) {
      Swal.fire({
        icon: "warning",
        title: "OTP đã hết hạn!",
        text: "Vui lòng nhập lại email để nhận mã mới.",
        confirmButtonText: "Quay lại",
      }).then(() => {
        router.push("/auth/ForgotPasswordForm"); // Điều hướng về trang nhập email
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Dọn sạch timer khi component unmount
  }, [timeLeft, router]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-300">
      <h1 className="text-custom-black-color font-semibold text-2xl mb-6 text-center">
        NHẬP MÃ OTP
      </h1>
      <p className="text-sm text-gray-500 mb-4">Mã OTP sẽ hết hạn sau {timeLeft} giây</p>
      <form className="mt-6 w-full px-5 lg:px-0" onSubmit={handleVerifyOTP}>
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Nhập mã OTP"
            onChange={handleOtpChange}
            required
            prefix={<KeyOutlined className="mr-3 text-[18px]" />} // Ant Design Key icon
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
          Xác nhận OTP
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
