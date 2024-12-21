import {Button, Form, Input, Modal, Select, message, TreeSelect} from "antd";
import React, { useEffect, useState } from "react";
import {useVariationStore} from "@/app/store/VariationStore";
import {useVariationOptionStore} from "@/app/store/VariationOptionStore";


export interface VariationOptionDto {
    name: string;
    variationId: number | null | undefined;
}

interface VariationOptionModalProps {
    variationOption?: any;
    isModalOpen?: boolean;
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export default function OptionForm({
                                          variationOption,
                                          isModalOpen,
                                          setIsModalOpen,
                                      }: VariationOptionModalProps) {
    const [form] = Form.useForm();
    const { variations,getAllVariations } = useVariationStore();
    const { updateVariationOption,createVariationOption } = useVariationOptionStore();
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
        if (!variationOption){
            form.resetFields();
            return;
        }
        form.setFieldsValue({
            value: variationOption.value,
            variationId: variationOption.variation ?variationOption.variation.id : null,
        });

    }, [isModalOpen]);

    const handleOk = async () => {

        const values = await form.validateFields();
        let res;
        setLoading(true);
        if (!variationOption) {
            res= await createVariationOption(values);
        } else {

            res=await updateVariationOption(variationOption.id, values);
        }
        setLoading(false);


        if (setIsModalOpen&&res){
            setIsModalOpen(false);
        }
    };


    return (
        <Modal title={variationOption ? "Cập nhật tùy chọn" : "Tạo mới tùy chọn"}
               open={isModalOpen}
               onCancel={handleCancel}
               onOk={handleOk}
               okText="Lưu"
               cancelText="Hủy"
               confirmLoading={loading}
        >
            <div style={{ margin: '0 auto', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Form layout="vertical" form={form} autoComplete="off">

                    <Form.Item label="Nhập tùy chọn " name="value" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input placeholder="Nhập tùy chọn" />
                    </Form.Item>


                    <Form.Item label="Chọn biến thể" name="variationId" rules={[{ required: true, message: 'Vui lòng chọn biến thể!' }]}>
                        <Select
                            placeholder="Chọn biến thể"
                            options={variations.map((variation: any) => ({
                                label: variation.name,
                                value: variation.id,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
