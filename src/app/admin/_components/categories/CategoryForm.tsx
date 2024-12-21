import {Button, Form, Input, Modal, Select, message, TreeSelect} from "antd";
import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/app/store/CategoryStore";

export interface CategoryDto {
    name: string;
    parentId: number | null | undefined;
}

interface CategoryModalProps {
    category?: any;
    isModalOpen?: boolean;
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export default function CategoryForm({
                                         category,
                                         isModalOpen,
                                         setIsModalOpen,
                                     }: CategoryModalProps) {
    const [form] = Form.useForm();
    const { categoriesTree, createCategory, updateCategory } = useCategoryStore();
    const [loading,setLoading]=useState(false);
    const handleCancel = () => {
        if (isModalOpen && setIsModalOpen) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if(!isModalOpen){
            return;
        }
        if(!category){
            form.resetFields();
            return;
        }
        form.setFieldsValue({
            name: category.name,
            parentId: category.parent ? category.parent.id : null,
        });

    }, [isModalOpen,categoriesTree]);



    const handleOk = async () => {
        const values = await form.validateFields();
        let res;
        setLoading(true);
        if (!category) {
            res = await createCategory(values);
        } else {
            res = await updateCategory(category.id, values);
        }
        setLoading(false);
        if (setIsModalOpen&&res){
            setIsModalOpen(false);
        }
    };


    return (
        <Modal title={category ? "Cập nhật danh mục" : "Tạo mới danh mục"}
               open={isModalOpen}
               onCancel={handleCancel}
               onOk={handleOk}
               okText="Lưu"
               cancelText="Hủy"
               confirmLoading={loading}
        >
            <div style={{ margin: '0 auto', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Form layout="vertical" name="add-category" form={form} autoComplete="off">

                    <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>


                    <Form.Item label="Danh mục cha" name="parentId">
                        <TreeSelect
                            treeData={categoriesTree}
                            placeholder="Chọn danh mục cha"
                            allowClear

                        />
                    </Form.Item>


                </Form>
            </div>
        </Modal>
    );
}
