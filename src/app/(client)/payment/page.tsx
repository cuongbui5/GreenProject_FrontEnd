"use client";
import React, {useEffect, useState} from "react";
import {Button, Checkbox, Input, message, Modal, Spin} from "antd";
import {useOrderStore} from "@/app/store/OderStore";
import {deleteOrder, payment, updateContactOrder} from "@/apis/modules/order";
import {handleApiRequest, showAlert} from "@/app/util/utils";
import {useRouter, useSearchParams} from "next/navigation";

import ContactForm from "@/app/(client)/_components/ContactForm";
import {useContactStore} from "@/app/store/ContactStore";
import {useVoucherStore} from "@/app/store/VoucherStore";
import {usePaymentAccountStore} from "@/app/store/PaymentAccountStore";








export default function Page() {
  const {order,setContactToOrder,setVoucherToOrder,getOrderById}=useOrderStore(state => state);
  const {contacts,getAllContact}=useContactStore(state => state);
  const {paymentAccounts,getAllPaymentAccounts}=usePaymentAccountStore(state => state)
  const {userVouchers,getMyVoucher}=useVoucherStore(state => state);
  const [isModalAddContactOpen,setIsModalAddContactOpen]=useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<
      number | null
  >(0);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false); // For voucher modal
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isModalVisibleAddress, setIsModalVisibleAddress] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // For payment method modal
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if(order==null){
      getOrderById(Number(orderId))

    }
    if(contacts.length==0){
      getAllContact();
    }

    getMyVoucher(0);
    getAllPaymentAccounts()




  }, []);
  console.log(order)

  if(order==null) {
    return <div className="flex items-center justify-center h-screen">
      <Spin size="large"/>
    </div>
  }

  function handlePayment() {
    if (order.contact == null) {
      message.warning("Chưa có địa chỉ nhận hàng!")
      return;
    }
    if(selectedPaymentAccount==null){
      message.warning("Chưa có tài khoản thanh toán!")
      return;
    }
    setIsModalVisible(true);



  }



  // Xử lý modal address
  const showModalAddress = () => {
    setIsModalVisibleAddress(true);
  };

  const handleOkAddress =async () => {
    const apiCall=()=>updateContactOrder({orderId:order.id,contactId:selectedAddressId})
    await handleApiRequest(apiCall,(res)=>{
      const contact=contacts.filter((c:any)=>c.id===selectedAddressId)
      console.log(contact)
      setContactToOrder(contact[0])
      setIsModalVisibleAddress(false);
    })


  };

  const handleCancelAddress = () => {
    setIsModalVisibleAddress(false);
  };

  const handleSelectAddress = (id: number) => {
    setSelectedAddressId(id);
  };

  const showAddAddressModal = () => {
    setIsModalAddContactOpen(true);
    //setIsModalVisibleAddress(false);
  };


  // Xử lý modal voucher
  const showVoucherModal = () => setIsVoucherModalVisible(true);
  const handleVoucherModalCancel = () => setIsVoucherModalVisible(false);



  const handleSelectVoucher = (voucher:any) => setSelectedVoucher(voucher);

  const showPaymentModal = () => setIsPaymentModalVisible(true);
  const handlePaymentModalCancel = () => setIsPaymentModalVisible(false);

  const handleSelectPaymentMethod = (account: any) =>{
    setSelectedPaymentAccount(account)
  }





  async function handleDeleteOrder() {
    const apiCall=()=>deleteOrder(order.id);
    await handleApiRequest(apiCall,(res)=>{
      router.push("/home")
    })
  }

  async function handleVoucherModalOk() {
    const res:any=await setVoucherToOrder(selectedVoucher.id,order.id)
    if(res){
      setIsVoucherModalVisible(false);
    }


  }

  async function handleOk() {
    await handleApiRequest(
        ()=>payment({orderId:orderId, paymentAccountId:selectedPaymentAccount.id, pinCode:pin}),
        (res)=>{
          showAlert("Thanh toán đơn hàng thành công!")
          setIsModalVisible(false)
          router.push("/profile/orders")

    })

  }

  function handleCancel() {
    setIsModalVisible(false);
    setPin("")

  }

  return (
        <div className="container p-10 my-10 mb-36">
          <h1 className="text-2xl font-bold mb-8">Thanh Toán Đơn Hàng</h1>
          <div className=" bg-[#F5F5F5] rounded-sm flex flex-row items-center justify-between p-6 mb-4">
            {order.contact == null ? (<div className="flex flex-col gap-2">
              <h2 className="font-semibold text-[17px]">Địa chỉ nhận hàng</h2>
              <div className="flex flex-row gap-5">
                <p>Chưa có địa chỉ</p>
              </div>
            </div>) : (<div className="flex flex-col gap-2">
              <h2 className="font-semibold text-[17px]">Địa chỉ nhận hàng</h2>
              <div className="flex flex-row gap-5">
                <p>
                  {order.contact.fullName} - {" "}
                  {order.contact.phoneNumber}
                </p>
                <p>{order.contact.houseAddress}, {order.contact.ward}, {order.contact.district}, {order.contact.city}</p>
              </div>
            </div>)}

            <p
                className="underline cursor-pointer text-brand-primary"
                onClick={showModalAddress}
            >
              Thay đổi
            </p>
          </div>
          <div>
            <div className="grid grid-cols-12 gap-6 bg-[#F5F5F5] p-4 rounded-lg">
              <div className="col-span-6 font-semibold text-start ml-4">
                Sản phẩm
              </div>
              <div className="col-span-2 text-center font-semibold">Đơn giá</div>
              <div className="col-span-2 text-center font-semibold">Số lượng</div>
              <div className="col-span-2 text-center font-semibold">Số tiền</div>

            </div>

            {/* Danh sách sản phẩm trong giỏ hàng */}
            {order.items.map((item: any) => (
                <div
                    key={item.id}
                    className="grid grid-cols-12 gap-6 items-center bg-white p-4 mt-4 rounded-lg border-b"
                >
                  {/* Cột sản phẩm */}
                  <div className="col-span-6">
                    <div className="flex flex-row gap-8">
                      <img
                          src={item.productItem.product.images[0].url}
                          alt={item.productItem.product.name}
                          className="w-24 h-24 object-cover rounded-lg text-center"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">{item.productItem.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Danh mục: {item.productItem.product.category.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Phân loại hàng: {item.productItem.variationOptions?.map((option: any, index: number) => (
                            <span key={option.id}>
                        {option.value}
                              {index < item.productItem.variationOptions.length - 1 && ', '}
                       </span>
                        ))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cột giá */}
                  <div className="col-span-2 text-center">
              <span className="font-semibold">
                {item.productItem.price.toLocaleString("vi-VN")}đ
              </span>
                  </div>

                  {/* Cột số lượng */}
                  <div className="col-span-2 text-center flex items-center justify-center">
                    <p>{item.quantity}</p>
                  </div>

                  {/* Cột số tiền */}
                  <div className="col-span-2 text-center">
              <span className="font-semibold text-brand-primary">
                {item.totalPrice.toLocaleString(
                    "vi-VN"
                )}{" "}
                đ
              </span>
                  </div>


                </div>
            ))}
          </div>

          {/* Chọn Voucher */}
          <div className=" bg-[#F5F5F5] rounded-sm flex flex-row items-center justify-between mt-6 px-6 py-4 mb-4">
            <div className="flex flex-row gap-2">
              <h2 className="font-semibold text-[17px]">Mã Giảm Giá GreenNova</h2>
              <Button
                  className="mx-4"
                  type="default"
                  style={{
                    borderColor: "#4BAF47",
                    color: "#4BAF47",
                    padding: "10px 40px",
                    borderRadius: "6px",
                  }}
              >
                {selectedVoucher?.name ?? "Chưa áp dụng khuyến mãi nào!"}
              </Button>
            </div>
            <p
                className="underline cursor-pointer text-brand-primary"
                onClick={showVoucherModal}
            >
              Chọn Voucher
            </p>
          </div>

          {/* Chọn phương thức thanh toán */}
          <div className=" bg-[#F5F5F5] rounded-sm flex flex-row items-center justify-between mt-6 px-6 py-4 mb-4">
            <div className="flex flex-row gap-2">
              <h2 className="font-semibold text-[17px]">Hình Thức Thanh Toán</h2>
              <Button
                  className="mx-4"
                  type="default"
                  style={{
                    borderColor: "#4BAF47",
                    color: "#4BAF47",
                    padding: "10px 30px",
                    borderRadius: "6px",
                  }}
              >
                {selectedPaymentAccount?.bank?.name && selectedPaymentAccount?.fullName
                    ? `${selectedPaymentAccount.bank.name} - ${selectedPaymentAccount.fullName}`
                    : "Chưa có phương thức thanh toán"}
              </Button>

            </div>
            <p
                className="underline cursor-pointer text-brand-primary"
                onClick={showPaymentModal}
            >
              Chọn
            </p>
          </div>

          {/* Tổng tiền */}
          <div className="mt-8 flex flex-row justify-end gap-4 bg-[#F8FAF4] p-4">
            <div className="flex flex-col">
              <div className="flex justify-between gap-36 w-full mb-2">
                <h2 className="text-lg">Tổng tiền hàng:</h2>
                <span className="text-brand-primary">
              {
                order.productTotalCost.toLocaleString("vi-VN")
              }đ
            </span>
              </div>

              <div className="flex justify-between gap-36 w-full mb-2">
                <h2>Phí vận chuyển:</h2>
                <span className="text-brand-primary"> {
                  order.shippingCost.toLocaleString("vi-VN")
                }đ</span>
              </div>

              <div className="flex justify-between gap-36 w-full mb-2">
                <h2>Giảm giá:</h2>
                <span className="text-brand-primary">-{order.discountAmount.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="flex justify-between gap-36 w-full font-bold mt-4">
                <h2 className="text-lg">Thành tiền:</h2>
                <span className="text-brand-primary">
              {order.totalCost.toLocaleString("vi-VN")}đ
            </span>
              </div>
            </div>
          </div>


          <Button
              type="primary"
              onClick={handlePayment}
              style={{
                borderColor: "#4BAF47",
                padding: "12px 28px",
                fontSize: "1rem",
                borderRadius: "6px",
                marginTop: "16px",
                float: "right",
              }}
          >
            Đặt hàng

          </Button>
          <Button
              danger
              onClick={handleDeleteOrder}
              style={{
                borderColor: "#4BAF47",
                padding: "12px 28px",
                fontSize: "1rem",
                borderRadius: "6px",
                marginTop: "16px",
                marginRight: "20px",
                float: "right",
              }}
          >
            Hủy

          </Button>


          <Modal
              open={isModalVisibleAddress}
              onOk={handleOkAddress}
              onCancel={handleCancelAddress}
              okText="Xác nhận"
              cancelText="Trở lại"
              closable={false}
          >
            <div>
              <div className="flex flex-row justify-between p-2">
                <p className="font-semibold">Địa Chỉ Của Bạn</p>
                <p
                    className="underline cursor-pointer text-brand-primary"
                    onClick={showAddAddressModal}
                >
                  Thêm địa chỉ
                </p>
              </div>
              <div>
                {contacts.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex flex-row justify-start gap-3 items-center p-2 border-b"
                    >
                      <Checkbox
                          checked={selectedAddressId === item.id}
                          onChange={() => handleSelectAddress(item.id)}
                      />
                      <div>
                        <h2 className="font-semibold mb-1">{`${item.fullName} - ${item.phoneNumber}`}</h2>
                        <p className="text-gray-500">{`${item.houseAddress}, ${item.ward}, ${item.district}, ${item.city}`}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </Modal>

          {/* Add New Address Modal */}
          <ContactForm setIsModalOpen={setIsModalAddContactOpen} isModalOpen={isModalAddContactOpen}/>


          {/* Voucher Modal */}
          <Modal
              open={isVoucherModalVisible}
              onOk={handleVoucherModalOk}
              onCancel={handleVoucherModalCancel}
              okText="OK"
              cancelText="Trở lại"
          >
            <h2 className="font-semibold">Chọn Mã Giảm Giá</h2>
            <div className="grid grid-cols-1 h-[250px] overflow-y-auto">
              {userVouchers.map((voucher: any) => (
                  <div
                      key={voucher.id}
                      className="flex p-2 shadow-lg items-center bg-white border-b"
                  >
                    <Checkbox
                        checked={selectedVoucher?.id === voucher.id}
                        onChange={() => handleSelectVoucher(voucher)}
                    />
                    {/* Voucher Image */}
                    <img
                        src={`/client/products/${voucher.type}.png`}
                        alt={voucher.name}
                        className="w-28 h-28 object-cover rounded-lg"/>

                    {/* Voucher Content */}
                    <div className="ml-10 flex flex-col justify-between">
                      <h4 className="text-lg font-semibold">{voucher.name}</h4>
                      <p className="text-gray-500 text-sm">
                        Bắt đầu: {new Date(voucher.startDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Kết thúc:{new Date(voucher.endDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      </p>
                    </div>
                  </div>
              ))}
            </div>
          </Modal>

          {/* Payment Modal */}
          <Modal
              open={isPaymentModalVisible}
              onOk={handlePaymentModalCancel}
              onCancel={handlePaymentModalCancel}
              okText="OK"
              cancelText="Trở lại"
          >
            <h2 className="font-semibold">Chọn Phương Thức Thanh Toán</h2>
            <div>
              {paymentAccounts.length > 0 && paymentAccounts.map((item: any, index: any) => (
                  <div
                      key={index}
                      className="flex flex-row justify-between items-center p-4 border-b w-full bg-white shadow-sm rounded-lg hover:bg-gray-50 transition duration-300"
                  >
                    <Checkbox
                        checked={selectedPaymentAccount?.id === item.id}
                        onChange={() => handleSelectPaymentMethod(item)}
                    />
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
                    </div>
                  </div>

              ))}

            </div>
          </Modal>
          <div>
            <Modal
                title="Nhập mã PIN"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleOk}>
                    Xác nhận
                  </Button>
                ]}
            >
              <Input.Password
                  placeholder="Nhập mã PIN của bạn"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
              />
            </Modal>
          </div>
        </div>
    );
}
