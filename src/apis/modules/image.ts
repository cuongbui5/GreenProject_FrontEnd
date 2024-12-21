import {CategoryDto} from "@/app/admin/_components/categories/CategoryForm";
import api from "@/apis/request";
import {CreateImagesRequest, ImageDto} from "@/app/admin/_components/products/UploadImageForm";

export function createImage(image:ImageDto){
    return api.post('images/create',image)
}

export function getAllImagesByProductId(productId:number){
    return api.get(`images/${productId}`)
}


export function createImages(image:CreateImagesRequest){
    return api.post('images/createImages',image)
}


export function deleteImage(id:number){
    return api.delete(`images/delete/${id}`)
}