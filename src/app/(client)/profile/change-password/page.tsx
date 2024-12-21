"use client";
import Sidebar from "@/app/(client)/_components/Sidebar";
import React from "react";
import { Form, Input, Button, message } from "antd";
import { changePassword } from "@/apis/modules/user";

const { Item } = Form;

export default function Page() {
  const [form] = Form.useForm();

  const changePass = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const payload = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const res: any = await changePassword(payload);

      if (res.code === 200) {
        message.success("Mật khẩu đã được thay đổi thành công.");
      } else {
        message.error(res.message || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      message.error("Lỗi máy chủ, vui lòng thử lại sau.");
    }
  };

  const onFinish = async (values: any) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới không trùng khớp.");
      return;
    }

    await changePass(oldPassword, newPassword, confirmPassword);
  };

  return (
      <div className="w-4/5 bg-white p-16 shadow-lg h-[600px]">
        <h1 className="text-2xl font-bold mb-3">Đổi Mật Khẩu</h1>
        <p className="mb-2">Quản lý sự thay đổi mật khẩu để bảo vệ tài khoản</p>

        <div className="flex w-full mt-10 ml-6">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="flex flex-grow justify-between"
          >
            <div className="w-2/3 pr-4 flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="w-1/3">
                  <label className="font-medium">Mật khẩu cũ</label>
                </div>
                <div className="w-2/4">
                  <Form.Item
                    name="oldPassword"
                    className="m-0 mt-0"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu cũ!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu cũ" />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/3">
                  <label className="font-medium">Mật khẩu mới</label>
                </div>
                <div className="w-2/4">
                  <Form.Item
                    name="newPassword"
                    className="m-0 mt-0"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/3">
                  <label className="font-medium">Nhập lại mật khẩu mới</label>
                </div>
                <div className="w-2/4">
                  <Form.Item
                    name="confirmPassword"
                    className="m-0 mt-0"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu mới!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu mới" />
                  </Form.Item>
                </div>
              </div>

              <div className="flex justify-center mt-auto mr-[60px]">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-40 rounded-lg"
                >
                  Lưu
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
  );
}
