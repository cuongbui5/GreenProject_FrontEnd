import {Button, Form, Input, Modal, Select, message, TreeSelect} from "antd";
import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/app/store/CategoryStore";
import {useVariationStore} from "@/app/store/VariationStore";

export interface VariationDto {
    name: string;
    categoryId: number | null | undefined;
}

interface VariationModalProps {
    variation?: any;
    isModalOpen?: boolean;
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export default function VariationForm({
                                         variation,
                                         isModalOpen,
                                         setIsModalOpen,
                                     }: VariationModalProps) {
    const [form] = Form.useForm();
    const { createVariation, updateVariation } = useVariationStore();
    const { categoriesTree } = useCategoryStore();
    const [loading,setLoading]=useState(false);


    const handleCancel = () => {
        if (isModalOpen && setIsModalOpen) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }
        if(!variation){
            form.resetFields();
            return;
        }
        form.setFieldsValue({
            name: variation.name,
            categoryId: variation.category ? variation.category.id : null,
        });
    }, [isModalOpen]);

    const handleOk = async () => {

        const values = await form.validateFields();
        let res;
        setLoading(true)

        if (!variation) {
            res=await createVariation(values);
        } else {
            res=await updateVariation(variation.id, values);
        }
        setLoading(false)

        if (setIsModalOpen&&res){
            setIsModalOpen(false);

        }
    };


    return (
        <Modal title={variation ? "Cập nhật biến thể" : "Tạo mới biến thể"}
               open={isModalOpen}
               onCancel={handleCancel}
               onOk={handleOk}
               okText="Lưu"
               cancelText="Hủy"
               confirmLoading={loading}
        >
            <div style={{ margin: '0 auto', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Form layout="vertical" form={form} autoComplete="off">

                    <Form.Item label="Tên biến thể " name="name" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input placeholder="Nhập tên biến thể " />
                    </Form.Item>


                    <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn category!' }]}>
                        <TreeSelect
                            treeData={categoriesTree}
                            placeholder="Chọn danh mục"
                            allowClear

                        />
                    </Form.Item>


                </Form>
            </div>
        </Modal>
    );
}
