import {Form, Input, Modal, Select} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {createContact} from "@/apis/modules/contact";
import {handleApiRequest} from "@/app/util/utils";
import {useContactStore} from "@/app/store/ContactStore";

class ContactModalProps {
    contact?: any;
    isModalOpen?: boolean;
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export default function ContactForm({
                                        contact,
                                        isModalOpen,
                                        setIsModalOpen,
                                    }: ContactModalProps){
    const [form] = Form.useForm();
    const [addressData,setAddressData]=useState<any>([]);
    const [selectedWards, setSelectedWards] = useState<any>([]);
    const [selectedDistricts, setSelectedDistricts] = useState<any>([]);
    const [city,setCity]=useState("");
    const [district,setDistrict]=useState("");
    const [ward,setWard]=useState("");
    const {createContact,getAllContact}=useContactStore()


    useEffect(() => {
        const getLocalFromOpenApi=async ()=>{
            const res=await axios.get("https://provinces.open-api.vn/api/?depth=3")
            console.log(res)
            setAddressData(res.data)
        }
        if(addressData.length==0){
            getLocalFromOpenApi();
        }


    }, []);

    async function handleOk() {
        const values=await form.validateFields();
        const res:any= await createContact(values);
        if(res&&setIsModalOpen){
            getAllContact();
            setIsModalOpen(false);


        }


    }

    function handleCancel() {
        if (setIsModalOpen) {
            form.resetFields();
            setIsModalOpen(false)
        }

    }

    const handleCityChange = (value: string) => {
        setCity(value);
        setDistrict("");  // Reset giá trị quận/huyện khi chọn lại thành phố
        setSelectedWards([]);  // Reset danh sách xã/phường khi chọn lại thành phố

        // Lấy danh sách quận/huyện mới từ thành phố đã chọn
        const selectedCity = addressData.find((city: any) => city.name === value);
        if (selectedCity) {
            setSelectedDistricts(selectedCity.districts || []);  // Cập nhật quận/huyện
        } else {
            setSelectedDistricts([]);  // Không có quận/huyện
        }

        // Reset lại trường quận/huyện và xã/phường trong form
        form.setFieldsValue({
            district: undefined,
            ward: undefined,
        });
    };

    const handleDistrictChange = (value: string) => {
        setDistrict(value);

        // Lấy danh sách xã/phường mới từ quận/huyện đã chọn
        const selectedDistrict = selectedDistricts.find((district: any) => district.name === value);
        if (selectedDistrict) {
            setSelectedWards(selectedDistrict.wards || []);  // Cập nhật xã/phường
        } else {
            setSelectedWards([]);  // Không có xã/phường
        }

        // Reset lại trường xã/phường trong form
        form.setFieldsValue({
            ward: undefined,
        });
    };





    return  <Modal
        title={contact ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
    >
        <Form form={form} layout="vertical">
            <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
                <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                        pattern: /^\d+$/,
                        message: "Số điện thoại không hợp lệ!",
                    },
                ]}
            >
                <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
                label="Địa chi nhà "
                name="houseAddress"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ nhà!" }]}
            >
                <Input placeholder="Nhập địa chỉ nhà" />
            </Form.Item>

            <Form.Item label="Tỉnh/Thành phố" name="city"  rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}>
                <Select

                    placeholder="Chọn tỉnh/thành phố"
                    options={addressData.map((city: any) => ({
                        label: city.name,
                        value: city.name,
                    }))}
                    onChange={handleCityChange}
                />

            </Form.Item>

            <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}>
                <Select
                    placeholder="Chọn quận/huyện"
                    options={selectedDistricts.map((district: any) => ({
                        label: district.name,
                        value: district.name,
                    }))}
                    onChange={handleDistrictChange}
                    disabled={city==""}
                />
            </Form.Item>

            <Form.Item label="Xã/Phường" name="ward" rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}>
                <Select
                    placeholder="Chọn xã/phường"
                    options={selectedWards.map((ward: any) => ({
                        label: ward.name,
                        value: ward.name,
                    }))}
                    disabled={district==""}
                />
            </Form.Item>
        </Form>
    </Modal>
}