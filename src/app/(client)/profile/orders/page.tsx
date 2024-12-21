"use client";
import React, {useEffect, useState} from "react";
import {Button, Spin, Tabs} from "antd";
import {handleApiRequest} from "@/app/util/utils";
import {getOrderByStatus, updateOrderStatus} from "@/apis/modules/order";




export default function Page() {
    const [activeTab, setActiveTab] = useState("PENDING");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchOrderUserStatus = async (status: string) => {
        setLoading(true);
        await handleApiRequest(() => getOrderByStatus(status), (res) => {
            setOrders(res.data);
            console.log(res.data);
        });
        setLoading(false);
    };
    const getButtonLabel = () => {
        switch (activeTab) {
            case "PENDING":
                return "Hủy";
            case "SHIPPED":
                return "Đã nhận được hàng";
            case "DELIVERED":
                return "Trả hàng";
            case "CANCELED":
            case "RETURNED":
                return "Mua lại";
            default:
                return null;
        }
    };

    const updateStatus=async (orderId:number,status:string)=>{
        await handleApiRequest(()=>updateOrderStatus(orderId,{orderStatus:status}),(res)=>{
            fetchOrderUserStatus(activeTab)
        })
    }
    const getButtonAction = async (id:number) => {
        console.log(activeTab)
        switch (activeTab) {
            case "PENDING":
                await updateStatus(id,"CANCELED");
                return setActiveTab("CANCELED");
            case "SHIPPED":
                await updateStatus(id,"DELIVERED");
                return setActiveTab("DELIVERED");
            case "DELIVERED":
                await updateStatus(id,"RETURNED");
                return setActiveTab("RETURNED");
            case "CANCELED":
            case "RETURNED":
                return null; // Hàm xử lý mua lại
            default:
                return null;
        }
    };

    useEffect(() => {
        fetchOrderUserStatus(activeTab);
    }, [activeTab]);

    const tabs = [
        {key: "PENDING", label: "Chờ xác nhận"},
        {key: "PROCESSING", label: "Chờ lấy hàng"},
        {key: "SHIPPED", label: "Chờ giao hàng"},
        {key: "DELIVERED", label: "Đã giao"},
        {key: "CANCELED", label: "Đã huỷ"},
        {key: "RETURNED", label: "Trả hàng"},
    ];
    const canReturnOrder = (order:any) => {

        const currentDate = new Date();
        const deliveredDate = new Date(order.updatedAt);
        const differenceInTime = currentDate.getTime() - deliveredDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return order.status === "DELIVERED" && differenceInDays <= 15;
    };



    return (
        <div className="w-4/5 bg-white p-12 shadow-lg h-[600px] overflow-auto">
            <h1 className="text-2xl font-bold mb-3">Đơn Mua</h1>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={tabs.map((tab) => ({
                    key: tab.key,
                    label: tab.label,
                    children: (
                        <div className="flex flex-col mt-6">
                            {loading ? (
                                <div className="flex justify-center items-center h-60">
                                    <Spin size="large"/>
                                </div>
                            ) : (
                                <>
                                    {orders.length === 0 ? (
                                        <p className="text-center">Không có đơn hàng nào</p>
                                    ) : (
                                        orders.map((order: any) => (
                                            <div key={order.id}>
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="text-lg font-bold ml-5">Đơn hàng #{order.id}</p>
                                                    <p className="font-thin text-xs text-gray-500">Thời gian đặt
                                                        hàng: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                                <div className="flex flex-col space-y-3 ml-4 h-40 overflow-y-auto">
                                                    {order.items.map((item: any) => (
                                                        <div key={item.id} className="grid grid-cols-12 gap-6 items-center bg-white p-4 mt-4 rounded-lg border-b">
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
                                                                            Danh
                                                                            mục: {item.productItem.product.category.name}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">
                                                                            Phân loại
                                                                            hàng: {item.productItem.variationOptions.map((option: any) => option.value).join(' ,')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2 text-center">
                                                                  <span className="font-semibold">
                                                                     {item.productItem.price.toLocaleString("vi-VN")}đ
                                                                  </span>

                                                            </div>
                                                            <div className="col-span-2 text-center flex items-center justify-center">
                                                                <p>X{item.quantity}</p>

                                                            </div>

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
                                                <div className="flex justify-end mt-3 mr-5">

                                                    <div className=" text-right font-semibold text-sm">
                                                        <p>Trạng thái: <span
                                                            className="ml-2 text-brand-primary text-base">
                                                                {tab.label}
                                                            </span></p>

                                                        {/*<p>Phí vận chuyển :
                                                            <span className="ml-2 text-brand-primary text-base">
                                                                {order.shippingCost.toLocaleString("vi-VN")}đ
                                                            </span>
                                                        </p>
                                                        <p>Giảm giá :
                                                            <span className="ml-2 text-brand-primary text-base">
                                                                -{order.discountAmount.toLocaleString("vi-VN")}đ
                                                            </span>
                                                        </p>*/}
                                                        <p>Tổng tiền:
                                                            <span className="ml-2 text-brand-primary text-base">
                                                                {order.totalCost.toLocaleString("vi-VN")}đ
                                                            </span>
                                                        </p>
                                                        {activeTab==="DELIVERED"&&
                                                            <Button type="primary"
                                                                    onClick={canReturnOrder(order) ? () => getButtonAction(order.id) : undefined}
                                                                    className="mt-2"
                                                                    style={{
                                                                        padding: "6px 20px",
                                                                        fontWeight: "bold",
                                                                        backgroundColor: canReturnOrder(order) ? "#1890ff" : "#bfbfbf", // Màu nút
                                                                        cursor: canReturnOrder(order) ? "pointer" : "not-allowed" // Cursur
                                                                    }}
                                                                    disabled={!canReturnOrder(order)}
                                                            >
                                                                {getButtonLabel()}
                                                            </Button>}

                                                        {(activeTab!="DELIVERED"&&activeTab!="PROCESSING")&& <Button type="primary"
                                                                onClick={ () => getButtonAction(order.id) }
                                                                className="mt-2"
                                                                style={{
                                                                    padding: "6px 20px",
                                                                    fontWeight: "bold",
                                                                }}

                                                        >
                                                            {getButtonLabel()}
                                                        </Button>}




                                                    </div>
                                                </div>
                                            </div>

                                        ))
                                    )}
                                </>
                            )}
                        </div>
                    ),
                }))}
            />


        </div>
    );
}
