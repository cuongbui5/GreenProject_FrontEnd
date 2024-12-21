import {create} from "zustand";
import {handleApiRequest} from "@/app/util/utils";
import {CreateImagesRequest, ImageDto} from "@/app/admin/_components/products/UploadImageForm";
import {createImage, createImages, deleteImage, getAllImagesByProductId} from "@/apis/modules/image";

interface ImageState {
    productId:number,
    images:any[],
    imagesUploaded:any[],
    loading:boolean,
    setProductId:(id:number)=>void
    getAllImages:()=>Promise<void>,
    createImage:(image:ImageDto)=>Promise<void>,
    createImages:(image:CreateImagesRequest)=>Promise<void>,
    deleteImage:(id:number)=>Promise<void>

}

export const useImageStore=create<ImageState>((set,get)=>({
    productId:0,
    images:[],
    imagesUploaded:[],
    loading:false,
    setProductId:(id:number)=>{
        set({
            productId:id
        })


    },
    getAllImages: async ()=>{
        if(get().productId==0){
            return;
        }
        const apiCall = () => getAllImagesByProductId(get().productId);
        const onSuccess = (response: any) => {
            console.log(response.data)
            set({
                images:response.data
            })
        };
        await handleApiRequest(apiCall, onSuccess, (loading:boolean) => set({ loading }));
    },

    createImage:async (image:ImageDto)=>{
        const apiCall = () => createImage(image);
        const onSuccess = () => {
            get().getAllImages();
        };
        await handleApiRequest(apiCall, onSuccess, (loading:boolean) => set({ loading }));

    },
    createImages:async (images:CreateImagesRequest)=>{

        const apiCall = () => createImages(images);
        const onSuccess = (response: any) => {
            get().getAllImages();
        };
        await handleApiRequest(apiCall, onSuccess, (loading:boolean) => set({ loading }));
    },

    deleteImage:async (id:number)=>{
        const apiCall = () => deleteImage(id);
        const onSuccess = (response: any) => {
            get().getAllImages();
        };
        await handleApiRequest(apiCall, onSuccess, (loading:boolean) => set({ loading }));

    }


}))
