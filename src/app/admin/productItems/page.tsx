"use client"
import React, { useEffect, useState } from "react";
import {Button, Col, Input, Modal, Row, Select, Table, theme, Upload} from "antd";
import CategoryForm from "@/app/admin/_components/categories/CategoryForm";
import { Header } from "antd/es/layout/layout";
import { Category } from "@/app/model/Category";
import {DeleteOutlined, EditOutlined, UploadOutlined} from "@ant-design/icons";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { SearchProps } from "antd/es/input";
import {useProductStore} from "@/app/store/ProductStore";
import {Product} from "@/app/model/Product";
import ProductForm from "@/app/admin/_components/products/ProductForm";
import UploadImageForm from "@/app/admin/_components/products/UploadImageForm";
import {useImageStore} from "@/app/store/ImageStore";
import ProductItemForm from "@/app/admin/_components/productItems/ProductItemForm";
import {useProductItemStore} from "@/app/store/ProductItemStore";
import {PAGE_SIZE} from "@/app/util/constant";


const { confirm } = Modal;
const { Search } = Input;

export default function Page() {
    const {
        productItems,
        getAllProductItems,
        deleteProductItem,
        setProductId,
        setSearch,
        current,
        totalElements
    } = useProductItemStore((state) => state);

    const {products,getAllProducts}=useProductStore()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productItem, setProductItem] = useState<any | null>(null);
    const [loading,setLoading]=useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_: any, record: any) => (
                <span>{record.product ? record.product.name : 'N/A'}</span>
            ),

        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',

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
            render: (_: any, record: Product) => (
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
    const fetchProductItem=async (page:number)=>{
        setLoading(true);
        const res = await getAllProductItems(page);
        if(res!=null){
            setLoading(false);
        }
    }

    useEffect(() => {
        if(productItems.length==0){
            fetchProductItem(current)
        }
        if(products.length==0){
            getAllProducts()
        }

    }, []);



    const handleEdit = (record:any ) => {
        setProductItem(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (record: Product) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa ct san pham này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {

                await deleteProductItem(record.id);
            },
            onCancel() {
                console.log('Hủy bỏ xóa');
            },
        });
    };

    const handleTableChange = async (pagination: { current: number; pageSize: number }) => {
        await fetchProductItem(pagination.current);
    };



    function handleAddButton() {
        setProductItem(null);
        setIsModalOpen(true);
    }



    async function handleChangeSelect(value:any) {
        console.log(value)
        if(value==undefined){
            setProductId(0)
        }else {
            setProductId(value)
        }
        await fetchProductItem(1);

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
                    Quản lý chi tiết sản phẩm
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
                        <Select
                            onChange={handleChangeSelect}
                            placeholder="Chọn sản phẩm"
                            options={products.map((p: any) => ({
                                label: p.name,
                                value: p.id,
                            }))}
                            style={{width:250}}
                        />
                    </Col>
                    <Col className="flex justify-end">
                        <Button
                            type="primary"
                            onClick={handleAddButton}
                            className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 rounded-md shadow-md"
                        >
                            Thêm mới chi tiết sản phẩm
                        </Button>
                    </Col>
                </Row>
                <ProductItemForm productItem={productItem}  isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

                <Table
                    dataSource={productItems}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current,
                        pageSize:PAGE_SIZE,
                        total: totalElements,
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
