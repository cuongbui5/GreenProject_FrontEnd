
import api from "@/apis/request";

import {VariationOptionDto} from "@/app/admin/_components/options/OptionForm";
import {PAGE_SIZE} from "@/app/util/constant";

export function getAllVariationOptions(pageNum:number,search:string,variationId:number) {
    if(search.trim()!=""){
        return api.get(`variation_options?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&search=${search.trim()}`);
    }

    if(variationId!=0){
        return api.get(`variation_options?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&variationId=${variationId}`);
    }


    return api.get(`variation_options?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);


}
export function findByProductItemId(productItemId:number){
    return api.get(`variation_options/product_item/${productItemId}`)
}


export function createVariationOption(variation:VariationOptionDto){
    return api.post('variation_options/create',variation)
}

export function updateVariationOptionById(id:number,variation:VariationOptionDto){
    return api.put(`variation_options/update/${id}`,variation)
}

export function deleteVariationOptionById(id:number){
    return api.delete(`variation_options/delete/${id}`)
}