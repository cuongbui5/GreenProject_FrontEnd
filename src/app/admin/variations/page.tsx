"use client"
import React, { useEffect, useState } from "react";
import {Button, Col, Input, Modal, Row, Table, theme, TreeSelect, Upload} from "antd";
import { Header } from "antd/es/layout/layout";
import { Category } from "@/app/model/Category";
import {DeleteOutlined, EditOutlined, UploadOutlined} from "@ant-design/icons";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { SearchProps } from "antd/es/input";
import {useVariationStore} from "@/app/store/VariationStore";
import VariationForm from "@/app/admin/_components/variations/VariationForm";
import {PAGE_SIZE} from "@/app/util/constant";


const { confirm } = Modal;
const { Search } = Input;

export default function Page() {
    const {
        variations,
        getAllVariations,
        deleteVariation
    } = useVariationStore((state) => state);
    const {categoriesTree,categories,getAllCategories}=useCategoryStore()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variation, setVariation] = useState<any | null>(null);
    const [loading,setLoading]=useState(false);
    const [paginationVariation, setPaginationVariation] = useState({
        current: 1,
        total: 0,
    });
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const fetchVariations=async ()=>{
        setLoading(true);
        const res =await getAllVariations();
        if(res!=null){
            setLoading(false);
            setPaginationVariation({
                ...paginationVariation,
                total: variations.length,

            });
        }
    }

    useEffect(() => {
        if(variations.length==0){
           fetchVariations();
        }
        if(categoriesTree.length==0){
            getAllCategories();
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
            title: 'Category',
            key: 'category',
            render: (_: any, record: any) => (
                <span>{record.category ? record.category.name : 'N/A'}</span>
            ),

            filters: categories.map((parent:any )=> ({
                text: parent.name,
                value: parent.id,  // Ensure this is a string or number
            })),
            onFilter: (value:any, record:any) => {
                // Assuming value is the parent ID which should match with record.parent.id
                return record.category ? record.category.id === Number(value) : false;
            },
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
            render: (_: any, record: Category) => (
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
        setVariation(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (record: any) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa danh mục này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                await deleteVariation(record.id);
            },
            onCancel() {
                console.log('Hủy bỏ xóa');
            },
        });
    };

    const handleTableChange =  (pagination: { current: number; pageSize: number }) => {
        setPaginationVariation({
            ...paginationVariation,
            current: pagination.current,

        });
    };



    function handleAddButton() {
        setVariation(null);
        setIsModalOpen(true);
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
                    Quản lý biến thể
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
                <Row  className="flex items-center justify-between mb-4">


                    <Col className="flex justify-end">
                        <Button
                            type="primary"
                            onClick={handleAddButton}
                            className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 rounded-md shadow-md"
                        >
                            Thêm mới biến thể
                        </Button>
                    </Col>
                </Row>
                <VariationForm variation={variation} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

                <Table
                    dataSource={variations}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current:paginationVariation.current,
                        pageSize:PAGE_SIZE,
                        total: paginationVariation.total,
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
