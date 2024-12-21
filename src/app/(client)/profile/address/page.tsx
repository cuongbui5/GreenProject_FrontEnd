"use client";
import Sidebar from "@/app/(client)/_components/Sidebar";
import React, {useEffect, useState} from "react";
import ContactForm from "@/app/(client)/_components/ContactForm";
import {useContactStore} from "@/app/store/ContactStore";




export default function Page() {


  const [contact,setContact]=useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {getAllContact,contacts,deleteContact}=useContactStore(state => state);


  useEffect(() => {
   getAllContact()
  }, []);



  return (

      <div className="w-4/5 bg-white p-16 shadow-lg h-[600px]">
        <h1 className="text-2xl font-bold mb-3">Địa chỉ của tôi</h1>
        <p className="mb-2">Quản lý địa chỉ giao hàng của bạn</p>

        <div className="flex flex-col gap-6 mt-10 ml-6 h-full">
          <div className="w-full overflow-y-auto h-[300px]">
              {contacts.length === 0 ? (
                  <div className="mt-4 text-gray-500">Không có liên hệ nào.</div>
              ) : (
                  contacts.map((item: any, index: any) => (
                      <div
                          key={index}
                          className="flex flex-row justify-between gap-6 mt-4 items-center p-2 border-b w-full"
                      >
                          <div className="flex flex-col gap-1 flex-grow">
                              <h2 className="font-medium mb-1">{`${item.fullName} - ${item.phoneNumber}`}</h2>
                              <p className="text-gray-500">
                                  {`${item.houseAddress}, ${item.ward}, ${item.district}, ${item.city}`}
                              </p>
                          </div>
                          <div className="flex flex-row gap-4">
                              <p
                                  className="underline text-brand-primary cursor-pointer"
                                  //onClick={() => showModal(item)}
                              >
                                  Cập nhật
                              </p>
                              <p
                                  className="text-red-600 cursor-pointer"
                                  onClick={async () => {
                                      await deleteContact(item.id)
                                  }}
                              >
                                  Xóa
                              </p>
                          </div>
                      </div>
                  ))
              )}
          </div>
          <p
            className="underline text-xl cursor-pointer text-brand-primary"
            onClick={() =>{
              setIsModalOpen(true)
            }}
          >
            Thêm địa chỉ
          </p>
        </div>
          <ContactForm contact={contact} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      </div>




  );
}
