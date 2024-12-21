"use client"
import React, { useEffect, useState } from "react";
import {Button, Col, Input, Modal, Row, Table, theme} from "antd";
import CategoryForm from "@/app/admin/_components/categories/CategoryForm";
import { Header } from "antd/es/layout/layout";
import { Category } from "@/app/model/Category";
import {DeleteOutlined, EditOutlined, SearchOutlined} from "@ant-design/icons";
import { useCategoryStore } from "@/app/store/CategoryStore";
import removeAccents from 'remove-accents';
import {PAGE_SIZE} from "@/app/util/constant";
import {Key} from "antd/es/table/interface";
const { confirm } = Modal;


export default function Page() {
    const {
        categories,
        deleteCategory,
        getAllCategories,
    } = useCategoryStore((state) => state);
    const [loading,setLoading]=useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState<Category | null>(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [paginationCategory, setPaginationCategory] = useState({
        current: 1,
        total: 0,
    });



    const fetchCategories=async ()=>{
        setLoading(true);
        const res = await getAllCategories();
        if(res!=null){
            setLoading(false);
            setPaginationCategory({
                ...paginationCategory,
                total: categories.length,

            });
        }
    }
    useEffect(() => {
        if(categories.length==0){
           fetchCategories();
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
            filterDropdown: ({
                                 setSelectedKeys,
                                 selectedKeys,
                                 confirm,
                             }: any) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Nhập văn bản ở đây"
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm({ closeDropdown: false });
                        }}
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    />
                );
            },
            filterIcon: () => <SearchOutlined />,
            onFilter: (value: any, record: any) => {
                return removeAccents(record.name.toLowerCase()).includes(removeAccents(value.toLowerCase()));
            },
            key: 'name',
        },
        {
            title: 'Parent Name',
            key: 'parentName',
            render: (_: any, record: Category) => (
                <span>{record.parent ? record.parent.name : 'N/A'}</span>
            ),
            filters: categories.map((parent:any )=> ({
                text: parent.name,
                value: parent.id,  // Ensure this is a string or number
            })),
            onFilter: (value:any, record:any) => {
                // Assuming value is the parent ID which should match with record.parent.id
                return record.parent ? record.parent.id === Number(value) : false;
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
            render: (_: any, record: Category) => (
                <div style={{ display: 'flex', gap: '8px' }}>
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

    const handleEdit = (record: Category) => {
        setCategory(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (record: Category) => {
        confirm({
            title: `Bạn có chắc chắn muốn xóa ${record.name}?`,
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                await deleteCategory(record.id);
            },
            onCancel() {
                console.log('Hủy bỏ xóa');
            },
        });
    };

    const handleTableChange =  (pagination: { current: number; pageSize: number }) => {
        setPaginationCategory({
            ...paginationCategory,
            current: pagination.current,

        });
    };



    function handleAddButton() {
        setCategory(null);
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
                    Quản lý danh mục
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

                    <Col className="flex justify-end">
                        <Button
                            type="primary"
                            onClick={handleAddButton}
                            className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 rounded-md shadow-md"
                        >
                            Thêm mới danh mục
                        </Button>
                    </Col>
                </Row>
                <CategoryForm category={category} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

                <Table
                    dataSource={categories}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current:paginationCategory.current,
                        pageSize:PAGE_SIZE,
                        total: paginationCategory.total,
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
