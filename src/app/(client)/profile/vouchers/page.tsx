"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/(client)/_components/Sidebar";
import { Button } from "antd";
import {useVoucherStore} from "@/app/store/VoucherStore";

export default function Page() {
  const {
    userVouchers,
    validVouchers,
    setUserVouchers,
    getMyVoucher,
    getAllValidVoucher,
    redeemVoucher,
  } = useVoucherStore((state) => state);

  const fetchMyVoucher=async ()=>{
    const res:any = await getMyVoucher(0);

    if(res.code == 200){
      
    }
  }

  const fetchValidVouchers=async ()=>{
    const res:any = await getAllValidVoucher(0);

    if(res.code == 200){
      
    }
  }

  useEffect(() => {
    if (!userVouchers || userVouchers.length === 0) {
      fetchMyVoucher(); 
    }

    if (!userVouchers || userVouchers.length === 0) {
      fetchValidVouchers(); 
    }
  }, []); 

  const handleRedeemVoucher = async(id:number) =>{
    const res:any = await redeemVoucher(id);
    console.log(res)
    if(res.code == 200){
      setUserVouchers([...userVouchers, res.data]);
    }
  }


  return (
      <div className="w-4/5 flex flex-col gap-5">

        <div className="bg-white p-8 shadow-lg h-[1000px] overflow-y-auto">
          <h1 className="text-2xl font-bold mb-3">Voucher Của Tôi</h1>
          <p className="mb-2">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

          <div className="grid grid-cols-2 gap-6 mt-10 ">
            {userVouchers.length > 0 ? (
                userVouchers.map((voucher) => (
                    <div
                        key={voucher.id}
                        className="flex p-4 shadow-lg rounded-md items-center bg-white transition-transform transform hover:scale-105"
                    >
                      <img
                          src={`/client/products/${voucher.type}.png`}
                          alt={voucher.name}
                          className="w-28 h-28 object-cover rounded-lg"/>

                      {/* Voucher Content */}
                      <div className="ml-4 flex flex-col justify-between">
                        <h4 className="text-lg font-semibold">{voucher.name}</h4>
                        <p className="text-gray-500 text-sm">
                          Bắt đầu: {new Date(voucher.startDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Kết thúc: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Bạn chưa có voucher nào.</p>
            )}
          </div>
        </div>

        {/* Hot Voucher */}
        <div className="bg-white p-8 shadow-lg h-[600px] overflow-y-auto">
          <h1 className="text-2xl font-bold mb-3">Kho Voucher Hot</h1>
          <p className="mb-2">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

          <div className="grid grid-cols-2 gap-6 mt-10">
            {validVouchers.length > 0 ? (
                validVouchers.map((voucher) => (
                    <div
                        key={voucher.id}
                        className="flex p-4 shadow-lg rounded-md items-center bg-white transition-transform transform hover:scale-105"
                    >
                      {/* Voucher Image */}
                      <img
                          src={`/client/products/${voucher.type}.png`}
                          alt={voucher.name}
                          className="w-28 h-28 object-cover rounded-lg"/>

                      {/* Voucher Content */}
                      <div className="ml-4 flex flex-col justify-between">
                        <h4 className="text-lg font-semibold">{voucher.name}</h4>
                        <p className="text-gray-500 text-sm">
                          Bắt đầu: {new Date(voucher.startDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Kết thúc: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Số điểm cần để đổi: {voucher.pointsRequired}
                        </p>
                        <Button
                            onClick={() => handleRedeemVoucher(voucher.id)}
                            type="default"
                            className="mt-2"
                        >
                          Đổi ngay
                        </Button>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Hiện chưa có voucher hot nào.</p>
            )}
          </div>
        </div>
      </div>


  );
}
