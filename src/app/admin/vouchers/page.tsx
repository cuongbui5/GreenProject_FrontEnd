"use client"
import React, { useEffect, useState } from "react";
import {Button, Col, Input, Modal, Row, Table, theme, Upload} from "antd";

import { Header } from "antd/es/layout/layout";
import { Category } from "@/app/model/Category";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

import { SearchProps } from "antd/es/input";
import OptionForm from "@/app/admin/_components/options/OptionForm";
import {useVoucherStore} from "@/app/store/VoucherStore";
import VoucherForm from "@/app/admin/_components/vouchers/VoucherForm";
import {PAGE_SIZE} from "@/app/util/constant";



const { confirm } = Modal;
const { Search } = Input;

export default function Page() {
    const {
        vouchers,
        setSearch,
        getAllVouchers,
        deleteVoucher,
        current,
        totalElements
    } = useVoucherStore((state) => state);




    const [isModalOpen, setIsModalOpen] = useState(false);
    const [voucher, setVoucher] = useState<any | null>(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [loading,setLoading]=useState(false);
    const fetchVoucher=async (page:number)=>{
        setLoading(true);
        const res = await getAllVouchers(page);
        if(res!=null){
            setLoading(false);
        }
    }

    useEffect(() => {
        if(vouchers.length==0){
            fetchVoucher(current)
        }

    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Points Required',
            dataIndex: 'pointsRequired',
            key: 'pointsRequired',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },

        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}

                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}

                    >
                        Delete
                    </Button>

                </div>
            ),
        },
    ];

    const handleEdit = (record: any) => {

        setVoucher(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (record: any) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa voucher này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {

                await deleteVoucher(record.id);
            },
            onCancel() {
                console.log('Hủy bỏ xóa');
            },
        });
    };

    const handleTableChange = async (pagination: { current: number; pageSize: number }) => {
        await fetchVoucher(pagination.current);
    };



    function handleAddButton() {
        setVoucher(null);
        setIsModalOpen(true);
    }

    const onSearch: SearchProps['onSearch'] =async (value, _e, info) => {
        setSearch(value);
        await fetchVoucher(1);

    }

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
                    Quản lý voucher
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
                <Row gutter={16} className="flex items-center justify-between mb-4">
                    <Col>
                        <Search
                            placeholder="Tìm kiếm biến thể"
                            allowClear
                            onSearch={onSearch}
                        />
                    </Col>
                    <Col className="flex justify-end">
                        <Button
                            type="primary"
                            onClick={handleAddButton}
                            className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 rounded-md shadow-md"
                        >
                            Thêm mới voucher
                        </Button>
                    </Col>
                </Row>
                <VoucherForm voucher={voucher} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

                <Table
                    dataSource={vouchers}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current,
                        pageSize:PAGE_SIZE,
                        total: totalElements,
                        showSizeChanger: true,
                        onChange: (page, size) => {
                            handleTableChange({ current: page, pageSize: size });
                        },
                    }}
                />
            </div>
        </>
    );
}
