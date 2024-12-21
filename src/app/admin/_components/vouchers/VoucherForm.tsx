import {Form, Input, Modal, Select, InputNumber, DatePicker, Row, Col} from "antd";
import React, { useEffect, useState } from "react";
import {useVoucherStore} from "@/app/store/VoucherStore";
import {VoucherType} from "@/app/model/VoucherType";
import moment from "moment";




interface VoucherModalProps {
    voucher?: any;
    isModalOpen?: boolean;
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}
const { RangePicker } = DatePicker;

export default function VoucherForm({
                                          voucher,
                                          isModalOpen,
                                          setIsModalOpen,
                                      }: VoucherModalProps) {
    const [form] = Form.useForm();
    const { createVoucher, updateVoucher } = useVoucherStore();
    const [loading,setLoading]=useState(false);



    const handleCancel = () => {
        if (isModalOpen&&setIsModalOpen) {
            form.resetFields();
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            return;

        }
        if(!voucher){
            form.resetFields();
            return;
        }
        form.setFieldsValue({
            ...voucher,
            dateRange: [
                voucher.startDate ? moment(voucher.startDate) : null,
                voucher.endDate ? moment(voucher.endDate) : null
            ],
        });
    }, [isModalOpen]);

    const handleOk = async () => {

        const values = await form.validateFields();
        console.log(values)
        if (values.dateRange && values.dateRange.length === 2) {
            const [startMoment, endMoment] = values.dateRange;
            values.startDate = startMoment.toISOString();
            values.endDate = endMoment.toISOString();
            delete values.dateRange;
        }

        let res;
        setLoading(true)

        if (!voucher) {
            res=await createVoucher(values);
        } else {

            res=await updateVoucher(voucher.id, values);
        }
        setLoading(false);


        if (setIsModalOpen&&res){
            setIsModalOpen(false);

        }
    };


    return (
        <Modal
            title={voucher ? "Cập nhật voucher" : "Tạo mới voucher"}
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên Voucher"
                            name="name"
                            rules={[
                                { required: true, message: "Tên không được để trống" },
                                { min: 3, max: 100, message: "Tên phải có độ dài từ 3 đến 100 ký tự" }
                            ]}
                        >
                            <Input placeholder="Nhập tên voucher" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Loại Voucher"
                            name="type"
                            rules={[{ required: true, message: "Loại voucher không được để trống" }]}
                        >
                            <Select placeholder="Chọn loại voucher">
                                {Object.keys(VoucherType).map((type) => (
                                    <Select.Option key={type} value={type}>
                                        {type}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ max: 255, message: "Mô tả không được dài quá 255 ký tự" }]}
                >
                    <Input.TextArea rows={3} placeholder="Nhập mô tả (tuỳ chọn)" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                { required: true, message: "Số lượng không được để trống" },
                                { type: "number", min: 1, message: "Số lượng phải lớn hơn hoặc bằng 1" }
                            ]}
                        >
                            <InputNumber min={1} style={{ width: "100%" }} placeholder="Nhập số lượng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá trị"
                            name="value"
                            rules={[
                                { required: true, message: "Giá trị không được để trống" },
                                { type: "number", min: 0, message: "Giá trị phải lớn hơn hoặc bằng 0" }
                            ]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá trị voucher" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Điểm yêu cầu"
                            name="pointsRequired"
                            rules={[
                                { required: true, message: "Điểm yêu cầu không được để trống" },
                                { type: "number", min: 0, message: "Điểm yêu cầu phải lớn hơn hoặc bằng 0" }
                            ]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập điểm yêu cầu" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày bắt đầu và kết thúc"
                            name="dateRange"
                            rules={[{ required: true, message: "Ngày không được để trống" }]}
                        >
                            <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};