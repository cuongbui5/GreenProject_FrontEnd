import api from "@/apis/request";
import { PAGE_SIZE } from "@/app/util/constant";

export function getAllReviewByProductItemId(pageNum:any,productItemId:any) {
    return api.get(`reviews?productItemId=${productItemId}&pageNum=${pageNum}&pageSize=${PAGE_SIZE}`)
}

export function getReviewById(productItemId:any){
    return api.get(`reviews/product_item/${productItemId}`)
}

export function createReview(review:any){
    return api.post('reviews/create',review)
}

// export function updateReviewById(review:any){
//     return api.put(`reviews/update`,review)
// }

export function deleteReviewById(productItemId:number){
    return api.delete(`reviews/delete/product_item/${productItemId}`)
}