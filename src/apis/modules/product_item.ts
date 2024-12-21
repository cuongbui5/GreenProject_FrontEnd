import api from "@/apis/request";
import {PAGE_SIZE} from "@/app/util/constant";


export function getAllProductItems(pageNum:number,search:string,productId:number) {
    if(pageNum==0){
        return api.get("productItems");
    }
    if(productId!=0){
        return api.get(`productItems?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&productId=${productId}`);
    }
    if(search.trim()!=""){
        return api.get(`productItems?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&search=${search.trim()}`);
    }

    return api.get(`productItems?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);


}

export function createNewProductItem(productItem:any){
    return api.post('productItems/create',productItem);
}


export function updateProductItemById(id:number,productItem:any){
    return api.put(`productItems/update/${id}`,productItem);
}

export function deleteProductItemById(id:number){
    return api.delete(`productItems/delete/${id}`);
}

export function getAllProductItemByProductId(productId:number){
    return api.get(`productItems/product/${productId}`);
}