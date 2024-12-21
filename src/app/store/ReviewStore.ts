
import {create} from "zustand";
import {handleApiRequest} from "@/app/util/utils";
import {getAllReviewByProductItemId,createReview,deleteReviewById} from "@/apis/modules/review";


interface ReviewState {
    reviews: any[];
    currentProductItem: any;
    setCurrentProductItem:(productItem:any) => void,
    getAllReviewByProductItemId: (page: number,productItemId:any) => Promise<void>;
    createReview: (review: any,productItemId:any) => Promise<void>;
    deleteReviewById: (id: number,productItemId:any) => Promise<void>;
    current: number;
    totalElements: number;
}

export const useReviewStore=create<ReviewState>((set,get)=>({
    reviews:[],
    current: 1,
    totalElements: 0,
    currentProductItem:null,




    setCurrentProductItem: (productItem:any) => {
        set({ currentProductItem: productItem });
    },


    getAllReviewByProductItemId: async (page: number,productItemId:any) => {
        const apiCall = () => getAllReviewByProductItemId(page,productItemId);
        const onSuccess = (response: any) => {
                set({
                    reviews: response.data.content,
                    current: page,
                    totalElements: response.data.totalElements,
                });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    createReview: async (voucher:any,productItemId:any) => {
        const apiCall = () => createReview(voucher);
        const onSuccess = (response: any) => {
            //get().getAllReviewByProductItemId(get().current,productItemId);
        };
        return await handleApiRequest(apiCall, onSuccess);
    },



    deleteReviewById:async (id:number,productItemId:any)=>{
        const apiCall = () => deleteReviewById(id);
        const onSuccess = (response: any) => {
            if (get().reviews.length === 1 && get().current > 1) {
                get().getAllReviewByProductItemId(get().current - 1,productItemId);
            } else {

                get().getAllReviewByProductItemId(get().current,productItemId);
            }
        };
        return await handleApiRequest(apiCall, onSuccess);
    }
}))
