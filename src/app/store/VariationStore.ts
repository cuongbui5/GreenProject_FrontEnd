import {Variation} from "@/app/model/Variation";
import {create} from "zustand";
import {message} from "antd";
import {
    createVariation,
    deleteVariationById,
    getAllVariations, getAllVariationsByproductId,
    updateVariationById
} from "@/apis/modules/variation";


import {VariationDto} from "@/app/admin/_components/variations/VariationForm";

import {handleApiRequest} from "@/app/util/utils";


interface VariationState {
    variations: any[];
    variationsByproductId:any[];
    setVariationsByproductId:(v:any[])=>void;
    categoryId:number;
    setCategoryId: (key: number) => void;
    getAllVariations: () => Promise<void>;
    getAllVariationsByProductId: (productId:number) => Promise<void>;
    createVariation: (variation: VariationDto) => Promise<void>;
    updateVariation: (id: number, variation: VariationDto) => Promise<void>;
    deleteVariation: (id: number) => Promise<void>;


}

export const useVariationStore=create<VariationState>((set,get)=>({
    variations:[],
    variationsByproductId:[],
    categoryId:0,
    setVariationsByproductId:(a:any[])=> {
        set({variationsByproductId:a})

    },

    setCategoryId:(id:number)=>{
        set({categoryId:id})
    },

    getAllVariations: async () => {
        const apiCall = () => getAllVariations();
        const onSuccess = (response: any) => {
            set({
                variations:response.data,
            })
        };


        return await handleApiRequest(apiCall, onSuccess);
    },
    getAllVariationsByProductId:async (productId)=>{
        const apiCall = () => getAllVariationsByproductId(productId);
        const onSuccess = (response: any) => {
            set({
                variationsByproductId:response.data
            })
        };
        return await handleApiRequest(apiCall, onSuccess);
    },
    createVariation: async (variation:VariationDto) => {
        const apiCall = () => createVariation(variation);
        const onSuccess = (response: any) => {
            set({
                variations:[...get().variations,response.data]
            })


        };
        return await handleApiRequest(apiCall, onSuccess);
    },
    updateVariation:async (id:number,v:VariationDto)=>{
        const apiCall = () => updateVariationById(id, v);
        const onSuccess = (response: any) => {
            const updatedVariations = get().variations.map((v: any) =>
                v.id === id ? response.data : v
            );

            set({
                variations: updatedVariations
            });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },
    deleteVariation:async (id:number)=>{
        const apiCall = () => deleteVariationById(id);
        const onSuccess = (response: any) => {
            const updatedVariations = get().variations.filter((v: any) => v.id !== id);
            // Cập nhật lại danh sách categories
            set({
                variations: updatedVariations
            });

        };
        return await handleApiRequest(apiCall, onSuccess);
    }
}))
