import {Form, Input, Modal, Select} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {createContact} from "@/apis/modules/contact";
import {handleApiRequest} from "@/app/util/utils";
import {useContactStore} from "@/app/store/ContactStore";
import {getAllBanks} from "@/apis/modules/bank";
import {usePaymentAccountStore} from "@/app/store/PaymentAccountStore";

class PaymentAccountProps {

    isModalOpen?: boolean;
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export default function PaymentAccountForm({isModalOpen, setIsModalOpen}: PaymentAccountProps){
    const [form] = Form.useForm();
    const [banks, setBanks] = useState([])
    const {linkAccount}=usePaymentAccountStore(state => state);
    useEffect(() => {
        const fetchAllBanks=async ()=>{
            await handleApiRequest(()=>getAllBanks(),(res)=>{
                setBanks(res.data);
            })
        }
        fetchAllBanks();
    }, []);


    async function handleOk() {
        const values = await form.validateFields();
        const res:any = await linkAccount(values);
        if(res&&setIsModalOpen){
            setIsModalOpen(false);


        }

    }

    function handleCancel() {
        if (setIsModalOpen) {
            setIsModalOpen(false);
        }

    }

    return  <Modal
        title={"Liên kết tài khoản thanh toán"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
    >
        <Form form={form} layout="vertical">
            <Form.Item
                label="Ngân hàng"
                name="bankId"
                rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
                <Select
                    placeholder="Chọn ngân hàng"
                    optionLabelProp="label"
                >
                    {banks.map((bank: any) => (
                        <Select.Option key={bank.id} value={bank.id} label={bank.name}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={bank.imageCover}
                                    alt={bank.name}
                                    style={{ width: '30px', marginRight: '10px' }}
                                />
                                <span>{bank.name}</span>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
                <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
                label="Số tài khoản"
                name="accountNumber"
                rules={[
                    { required: true, message: "Vui lòng nhập số tài khoản!" },
                ]}
            >
                <Input placeholder="Nhập số số tài khoản" />
            </Form.Item>
            <Form.Item
                label="Mã pin"
                name="pinCode"
                rules={[{ required: true, message: "Vui lòng nhập mã pin!" }]}
            >
                <Input placeholder="Nhập mã pin" />
            </Form.Item>

        </Form>
    </Modal>
}