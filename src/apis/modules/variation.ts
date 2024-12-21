import api from "@/apis/request";
import {VariationDto} from "@/app/admin/_components/variations/VariationForm";
import {PAGE_SIZE} from "@/app/util/constant";

/*export function getAllVariations(pageNum:number,search:string,categoryId:number) {
    if(pageNum==0){
        return api.get(`variations`);
    }

    if(search.trim()!=""){
        return api.get(`variations?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&search=${search.trim()}`);
    }

    if(categoryId!=0){
        return api.get(`variations?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&categoryId=${categoryId}`);
    }

    return api.get(`variations?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);


}*/

export function getAllVariations() {
    return api.get(`variations`);
}

export function getAllVariationsByproductId(productId:number) {
    return api.get(`variations/product/${productId}`);
}


export function createVariation(variation:VariationDto){
    return api.post('variations/create',variation)
}

export function updateVariationById(id:number,variation:VariationDto){
    return api.put(`variations/update/${id}`,variation)
}

export function deleteVariationById(id:number){
    return api.delete(`variations/delete/${id}`)
}