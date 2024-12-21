"use client"
import {Col, Form, Input, message, Modal, Row, Select, Spin, TreeSelect} from "antd";
import React, {useEffect, useState} from "react";
import {useProductStore} from "@/app/store/ProductStore";
import {useVariationStore} from "@/app/store/VariationStore";
import {useProductItemStore} from "@/app/store/ProductItemStore";
import {LoadingOutlined} from "@ant-design/icons";
import {findByProductItemId} from "@/apis/modules/variation_option";
import {handleApiRequest} from "@/app/util/utils";


interface ProductItemFormProps {
    productItem?: any | null,
    isModalOpen?: boolean,
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function ProductItemForm({productItem, isModalOpen, setIsModalOpen}: ProductItemFormProps) {

    const [form] = Form.useForm();
    const {products}=useProductStore();
    const {getAllVariationsByProductId,variationsByproductId,setVariationsByproductId}=useVariationStore();
    const {createProductItem,updateProductItem}=useProductItemStore()
    const [loading,setLoading]=useState(false);
    const [variationOptionList,setVariationOptionList]=useState<any>([])
    const [loadingVariations,setLoadingVariations]=useState(false);
    const [initialFormValues,setInitialFormValues]=useState<any>({})

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }
        if(!productItem){
            form.resetFields();
            setVariationsByproductId([])
            return;

        }
        setInitialFormValues({
            productId: productItem.product.id,
            quantity: productItem.quantity,
            price: productItem.price,
        })
        fetchData()

        // Set variation fields (variation_X)
        form.setFieldsValue(initialFormValues);




    }, [isModalOpen]);
    useEffect(() => {
        if (variationOptionList.length > 0) {
            const updatedFormValues = { ...initialFormValues };
            variationOptionList.forEach((variationOption: any) => {
                updatedFormValues[`variation_${variationOption.variation.id}`] = variationOption.id;
            });
            form.setFieldsValue(updatedFormValues); // Cập nhật form sau khi có dữ liệu
        }
    }, [variationOptionList]);


    const fetchVariations = async (productId:number) => {
         await getAllVariationsByProductId(productId);

    };

    const fetchOptionProductItem = async () => {const callApi = () => findByProductItemId(productItem.id);
       await handleApiRequest(callApi, (res) => {
            setVariationOptionList(res.data);
        });

    };


    const fetchData = async () => {
        setLoadingVariations(true);
        try {
            await Promise.all([fetchVariations(productItem.product.id), fetchOptionProductItem()]);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoadingVariations(false);
        }
    };




    async function handleOk() {

        const values = await form.validateFields();
        console.log(values)
        const productConfig = Object.keys(values)
            .filter(key => key.startsWith('variation_')) // Filter out the keys that start with 'variation_'
            .map(key => values[key])
            .filter(value => value !== undefined);
        const { productId, quantity, price, ...otherValues } = values;
        const updatedValues = {
            productId,
            quantity,
            price,
            productConfig, // Add the array of variations here
        };

        console.log(updatedValues);
        let res;
        setLoading(true)
        if (!productItem) {
            res=await createProductItem(updatedValues);
        } else {
            res=await updateProductItem(productItem.id, updatedValues);
        }
        setLoading(false)


        if (setIsModalOpen&&res){
            //setIsModalOpen(false);
        }

    }

    function handleCancel() {
        if(loadingVariations){
            message.warning("Có thao tác đang thực hiện")
            return;
        }
        if (isModalOpen && setIsModalOpen) {
            setIsModalOpen(false);

        }
    }


    async function handleChangeSelect(value:any) {
        setLoadingVariations(true);
        await fetchVariations(value);
        setLoadingVariations(false);

    }

    const handleSelectChange = (value: string, variationId: number) => {
        console.log(`Selected value: ${value} for variation: ${variationId}`);
        // Handle selection logic here
    };

    return <>
            <Modal
                title={productItem ? "Cập nhật chi tiết sản phẩm" : "Thêm mới chi tiết sản phẩm"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={800}
                centered
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                   // style={{ maxHeight: '500px', overflowY: 'auto' }}
                >

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Chọn sản phẩm"

                                name="productId"
                                rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                            >
                                <Select
                                    onChange={handleChangeSelect}
                                    disabled={!!productItem}
                                    placeholder="Chọn sản phẩm"
                                    options={products.map((p: any) => ({
                                        label: p.name,
                                        value: p.id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="quantity"
                                label="Số lượng"
                                rules={[{ required: true, message: 'Please input the product qty!' }]}
                            >
                                <Input placeholder="Nhập số lượng"/>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="price"
                                label="Giá"
                                rules={[{ required: true, message: 'Please input the product price!' }]}
                            >
                                <Input placeholder="Nhập giá sản phẩm"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Dynamic variation options */}
                    <Row gutter={24}>
                        {loadingVariations ? (
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </Col>
                        ) : (
                            variationsByproductId.map(variation => (
                                <Col span={12} key={variation.id}>
                                    <Form.Item
                                        label={`Chọn ${variation.name}`}
                                        name={`variation_${variation.id}`}
                                    >
                                        <Select
                                            placeholder={`Chọn giá trị cho ${variation.name}`}
                                            onChange={(value) => handleSelectChange(value, variation.id)}
                                            options={variation.values.map((p: any) => ({
                                                label: p.value,
                                                value: p.id,
                                            }))}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                            ))
                        )}
                    </Row>
                </Form>
            </Modal>
        </>
}