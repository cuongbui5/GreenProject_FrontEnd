"use client";
import Sidebar from "@/app/(client)/_components/Sidebar";
import React, {useEffect, useState} from "react";
import ContactForm from "@/app/(client)/_components/ContactForm";
import {useContactStore} from "@/app/store/ContactStore";
import {usePaymentAccountStore} from "@/app/store/PaymentAccountStore";
import PaymentAccountForm from "@/app/(client)/_components/PaymentAccountForm";




export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {paymentAccounts,getAllPaymentAccounts}=usePaymentAccountStore(state => state);


    useEffect(() => {
        if(paymentAccounts.length==0){
            getAllPaymentAccounts();
        }
    }, []);



    return (

            <div className="w-4/5 bg-white p-16 shadow-lg h-[600px]">
                <h1 className="text-2xl font-bold mb-3">Tài khoản thanh toán</h1>
                <p className="mb-2">Quản lý tài khoản thanh toán của bạn</p>

                <div className="flex flex-col gap-6 mt-10 ml-6 h-full">
                    <div className="w-full overflow-y-auto h-[300px]">
                        {paymentAccounts.length === 0 ? (
                            <div className="mt-4 text-gray-500">Không có tài khoản nào.</div>
                        ) : (
                            paymentAccounts.map((item: any, index: any) => (
                                <div
                                    key={index}
                                    className="flex flex-row justify-between items-center p-4 border-b w-full bg-white shadow-sm rounded-lg hover:bg-gray-50 transition duration-300"
                                >
                                    {/* Hiển thị ảnh của ngân hàng */}
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.bank.imageCover}  // Đường dẫn đến ảnh của ngân hàng
                                            alt={item.bank.name}    // Tên ngân hàng cho thuộc tính alt
                                            className="w-12 h-12 object-contain rounded-full border border-gray-200"
                                        />
                                        <div className="flex flex-col">
                                            <h2 className="font-semibold text-lg text-gray-900">{`${item.fullName}`}</h2>
                                            <p className="text-gray-500">{`${item.accountNumber}`}</p>
                                        </div>
                                    </div>

                                    {/* Hiển thị thông tin số dư và tên ngân hàng */}
                                    <div className="flex flex-col items-end text-right">
                                        <p className="text-gray-700 font-medium">
                                            Số dư: {item.balance.toLocaleString("vi-VN")} đ
                                        </p>
                                        <p className="text-gray-500">{item.bank.name}</p>
                                    </div>
                                </div>

                            ))
                        )}
                    </div>
                    <p
                        className="underline text-xl cursor-pointer text-brand-primary"
                        onClick={() => {
                            setIsModalOpen(true)
                        }}
                    >
                        Thêm tài khoản thanh toán
                    </p>
                </div>
                <PaymentAccountForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
            </div>


    );
}
