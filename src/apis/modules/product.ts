import api from "@/apis/request";
import {ProductDto} from "@/app/admin/_components/products/ProductForm";
import {PAGE_SIZE, PRODUCT_ITEM_PAGE_SIZE} from "@/app/util/constant";


export function getAllProducts() {
    return api.get("products");


}
export function getAllRelatedProduct(pageNum:number,categoryId:number){
    return api.get(`products/related_product?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&categoryId=${categoryId}`);
}

export function getProductOnTopSold(pageNum:number,pageSize:number){
    return api.get(`products/top_sold?pageNum=${pageNum}&pageSize=${pageSize}`);
}


// export function getAllProductsView(pageNum:number){
//     return api.get(`products/view?pageNum=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}`);
// }

export function getAllProductsSort(pageNum:number,option:string){
    return api.get(`products/sort?pageNum=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}&option=${option}`);
}


export function getAllProductsView(pageNum:number,search:string,categoryId:number) {
    if(pageNum==0){
        return api.get("products/view");
    }

    if(search.trim()!=""&&categoryId!=0){
        return api.get(`products/view?pageNum=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}&search=${search.trim()}&categoryId=${categoryId}`);
    }

    if(search.trim()!=""){
        return api.get(`products/view?pageNum=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}&search=${search.trim()}`);
    }

    if(categoryId!=0){
        return api.get(`products/view?pageNum=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}&categoryId=${categoryId}`);
    }

    return api.get(`products/view?pageNum=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}`);

}


export function getProductByStarRating(pageNum:number,ratingPoint:number){
    return api.get(`products/rating?=${pageNum}&pageSize=${PRODUCT_ITEM_PAGE_SIZE}&ratingPoint=${ratingPoint}`);
}
export function getProductById(productId:number){
    return api.get(`products/${productId}`);
}

export function createNewProduct(product:ProductDto){
    return api.post('products/create',product);
}


export function updateProductById(id:number,product:ProductDto){
    return api.put(`products/update/${id}`,product);
}

export function deleteProductById(id:number){
    return api.delete(`products/delete/${id}`);
}