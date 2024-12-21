import api from "@/apis/request";
import {CategoryDto} from "@/app/admin/_components/categories/CategoryForm";
import {PAGE_SIZE} from "@/app/util/constant";


/*export function getAllCategories(pageNum:any,search:string) {
    if(pageNum==0){
        return api.get(`categories`);
    }
    if(search.trim()!=""){
        return api.get(`categories?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&search=${search.trim()}`);
    }
    return api.get(`categories?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);


}*/

export function getAllCategories() {
    return api.get(`categories`);

}
/*export function getAllCategoriesParent() {
    return api.get(`categories/parents`);
}*/

export function createNewCategory(category:CategoryDto){
    return api.post('categories/create',category)
}


export function updateCategoryById(id:number,category:CategoryDto){
    return api.put(`categories/update/${id}`,category)
}

export function deleteCategoryById(id:number){
    return api.delete(`categories/delete/${id}`)
}