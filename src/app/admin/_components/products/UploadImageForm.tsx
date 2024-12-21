import { useEffect, useState } from "react";
import { Modal, Button, Upload, Image, message, UploadProps, Form } from "antd";
import { UploadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Product } from "@/app/model/Product";
import { ImageModel } from "@/app/model/Image";
import { useImageStore } from "@/app/store/ImageStore";
import axios from "axios";

interface UploadImageFormProps {
    product?: Product | null;
    isModalUploadOpen?: boolean;
    setIsModalUploadOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export interface ImageDto {
    url: string;
    productId: number;
}

export interface CreateImagesRequest {
    productId: number;
    images: string[];
}
const { Dragger } = Upload;

export default function UploadImageForm({ isModalUploadOpen, setIsModalUploadOpen }: UploadImageFormProps) {
    const [files, setFiles] = useState({});
    const { getAllImages, productId, deleteImage, setProductId, images } = useImageStore();
    const [showDeleteIcon, setShowDeleteIcon] = useState<number | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    useEffect(() => {
        if (isModalUploadOpen) {
            getAllImages();
        }
    }, [isModalUploadOpen]);
    const handleFileChange: UploadProps['onChange'] = ({ fileList }) => {
        setFileList(fileList); // Update the file list state
    };

    const customRequest: UploadProps['customRequest'] = async ({ file, onError, onProgress, onSuccess }) => {
        const getFileObject = (progress: any) => {
            return {
                // @ts-ignore
                name: file.name,
                // @ts-ignore
                uid: file.uid,
                progress: progress
            };
        };


        const formData = new FormData();
        formData.append("image", file);
        formData.append("productId", productId.toString());

        try {
            const res = await axios.post('http://localhost:7000/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
                onUploadProgress: (e: any) => {
                    console.log(`Loaded: ${e.loaded}, Total: ${e.total}`);
                    if (e.total) {
                        const percent = Math.round((e.loaded * 100) / e.total);
                        console.log(`Progress: ${percent}%`);
                        // @ts-ignore
                        setFiles((prevState) => ({
                            ...prevState,
                            // @ts-ignore
                            [file.uid]: getFileObject(percent),
                        }));

                        if (onProgress) {
                            onProgress({ percent });
                        }
                    }
                },
            });

            if (onSuccess) {
                onSuccess(res);


            }
            if(res.data.code==200){
                await getAllImages();
            }

        } catch (error: any) {
            console.log(error)
            if (onError) {
                onError(error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        console.log("Delete i");
        await deleteImage(id);
    };

    function handleCancel() {
        if (isModalUploadOpen && setIsModalUploadOpen) {
            setIsModalUploadOpen(false);
            setProductId(0);
            setFileList([]);

        }
    }

    return (
        <Modal

            open={isModalUploadOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">Ảnh sản phẩm</h2>

                <div className="relative grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative group"
                            onMouseEnter={() => setShowDeleteIcon(image.id)}
                            onMouseLeave={() => setShowDeleteIcon(null)}
                        >
                            <div className="w-32 h-32 overflow-hidden rounded-md shadow-md">
                                <Image
                                    src={image.url}
                                    alt="Product image"
                                    preview={false}
                                    className="w-full h-full object-cover"



                                />
                            </div>

                            {showDeleteIcon === image.id && (
                                <button
                                    className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    onClick={() => handleDelete(image.id)}
                                >
                                    <DeleteOutlined className="text-lg"/>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <Dragger
                    name="file"
                    multiple
                    fileList={fileList}
                    onChange={handleFileChange}
                    customRequest={customRequest}
                    showUploadList={{ showRemoveIcon: true }}
                >
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg transition duration-200 hover:border-blue-400 hover:bg-blue-50">
                        <InboxOutlined className="text-4xl text-blue-400 mb-2" />
                        <p className="text-sm font-medium text-gray-500 mb-1">Click hoặc kéo tệp vào đây để tải lên</p>
                        <p className="text-xs text-gray-400">
                            Hỗ trợ tải lên một hoặc nhiều tệp. Nghiêm cấm tải lên dữ liệu công ty hoặc các tệp bị cấm khác.
                        </p>
                    </div>
                </Dragger>
            </div>
        </Modal>

    );
}
