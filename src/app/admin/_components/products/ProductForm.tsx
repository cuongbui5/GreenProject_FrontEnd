import {useEffect, useState} from "react";
import {Form, Input, message, Modal, TreeSelect} from "antd";
import {useCategoryStore} from "@/app/store/CategoryStore";
import {useProductStore} from "@/app/store/ProductStore";
import TextArea from "antd/es/input/TextArea";
import {Product} from "@/app/model/Product";
import {updateProductById} from "@/apis/modules/product";

export interface ProductDto {
    name: string,
    description: string,
    categoryId: number | null | undefined,
}

interface ProductModalProps {
    isModalOpen?: boolean,
    setIsModalOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    product?: Product | null
}

export default function ProductForm({isModalOpen, setIsModalOpen, product}: ProductModalProps) {
    const [form] = Form.useForm();
    const [loading,setLoading]=useState(false);

    const {categoriesTree} = useCategoryStore();
    const {createProduct,updateProduct} = useProductStore();




    useEffect(() => {
        if (!isModalOpen) {
            return;

        }
        if(!product){
            form.resetFields();
            return;
        }
        form.setFieldsValue({
            name: product.name,
            description:product.description,
            categoryId: product.category ? product.category.id : null
        });

    }, [isModalOpen]);




    const handleOk = async () => {

        const values = await form.validateFields();
        let res;
        setLoading(true);
        if(!product){
            res= await createProduct(values);
        }else {
            res=await updateProduct(product.id,values);
        }
        setLoading(false);


        if (setIsModalOpen&&res){
            setIsModalOpen(false);

        }


    };

    const handleCancel = () => {
        if (setIsModalOpen) {
            setIsModalOpen(false);
        }
    };



    return (
        <>

            <Modal
                title={product ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: '',
                        description: '',
                        categoryId: null,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Tên sản phẩm"
                        rules={[{required: true, message: 'Please input the product name!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{required: true, message: 'Please input the product description!'}]}
                    >
                        <TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="Danh mục"
                       // rules={[{required: true, message: 'Please select a category!'}]}
                    >
                        <TreeSelect
                            placeholder="Select a category"
                            treeData={categoriesTree}
                            allowClear
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}