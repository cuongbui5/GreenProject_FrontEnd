"use client"
import React, { useEffect, useState } from "react";
import {Button, Col, Input, Modal, Row, Select, Table, theme, Upload} from "antd";

import { Header } from "antd/es/layout/layout";
import { Category } from "@/app/model/Category";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

import { SearchProps } from "antd/es/input";

import {useVariationOptionStore} from "@/app/store/VariationOptionStore";
import OptionForm from "@/app/admin/_components/options/OptionForm";
import {PAGE_SIZE} from "@/app/util/constant";
import {useVariationStore} from "@/app/store/VariationStore";
import {handleApiRequest} from "@/app/util/utils";
import {getAllOrders, updateOrderStatus} from "@/apis/modules/order";


const { confirm } = Modal;

export default function Page() {
    const [orders,setOrders]=useState([]);
    const [status,setStatus]=useState("PENDING")
    const [loading,setLoading]=useState(false);
    const [paginationOrder, setPaginationOrder] = useState({
        current: 1,
        total: 0,
    });
    const orderStatus=[ "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED", "RETURNED" ]

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const fetchOrders=async (current:number,status:string)=>{
        setLoading(true);
        await handleApiRequest(()=>getAllOrders(status,current),(res)=>{
            setOrders(res.data.content);
            setPaginationOrder(prevState => ({
                current: res.data.currentPage,
                total: res.data.totalElements,
            }));
            console.log(res)
        })

        setLoading(false);

    }
    useEffect(() => {
      fetchOrders(paginationOrder.current,status)

    }, [status]);



    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer',
            dataIndex: 'username',
            key: 'username',

        },
        {
            title: 'Product Total Cost',
            dataIndex: 'productTotalCost',
            key: 'productTotalCost',
            render: (text: number) => <span>{text.toLocaleString('vi-VN')}đ</span>,
        },
        {
            title: 'Shipping Cost',
            dataIndex: 'shippingCost',
            key: 'shippingCost',
            render: (text: number) => <span>{text.toLocaleString('vi-VN')}đ</span>,
        },
        {
            title: 'Discount Amount',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            render: (text: number) => <span>{text.toLocaleString('vi-VN')}đ</span>,
        },
        {
            title: 'Total Cost',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (text: number) => <span>{text.toLocaleString('vi-VN')}đ</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: any) => <span>{status}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Select
                        defaultValue={record.status}
                        onChange={(value) => handleUpdateStatus(record.id, value)}
                        style={{ width: 120 }}
                    >
                        {orderStatus.map((status) => (
                            <Select.Option key={status} value={status}>
                                {status}
                            </Select.Option>
                        ))}
                    </Select>
                    <Button type="primary">Xem chi tiết</Button>
                </div>
            ),
        },
    ];

    const handleUpdateStatus = async (orderId: number, orderStatus: any) => {
        await handleApiRequest(()=>updateOrderStatus(orderId,{orderStatus:orderStatus}), (res)=>{
             fetchOrders(paginationOrder.current,status)
        })

    };



    const handleTableChange = async (pagination: { current: number; pageSize: number }) => {

        await fetchOrders(pagination.current,status);
    };





    return (
        <>
            <Header style={{ padding: 0, background: colorBgContainer }}>
                <h1
                    className="title"
                    style={{
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '64px',
                        fontWeight: 'bold',
                        fontSize: '24px',
                    }}
                >
                    Quản lý trạng thái đơn hàng
                </h1>
            </Header>

            <div
                style={{
                    padding: 24,
                    paddingInline: 50,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Row gutter={[16,16]} className="flex items-center justify-between mb-4">

                    <Col className="flex justify-end">
                        <Select
                            defaultValue={status}
                            onChange={(value) => {setStatus(value)}}
                            style={{ width: 220 }}
                        >
                            {orderStatus.map((status) => (
                                <Select.Option key={status} value={status}>
                                    {status}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>


                <Table
                    dataSource={orders}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current:paginationOrder.current,
                        pageSize:PAGE_SIZE,
                        total: paginationOrder.total,
                        showSizeChanger: true,
                        onChange:async (page, size) => {
                            await handleTableChange({ current: page, pageSize: size });
                        },
                    }}
                />
            </div>
        </>
    );
}
