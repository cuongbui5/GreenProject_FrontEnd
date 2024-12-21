import { create } from "zustand";

import {handleApiRequest} from "@/app/util/utils";
import {
    createNewProductItem,
    deleteProductItemById,
    getAllProductItems,
    updateProductItemById
} from "@/apis/modules/product_item";
import {PAGE_SIZE} from "@/app/util/constant";

interface ProductItemState {
    productItems: any[];
    productId:number,
    setProductId: (key: number) => void;
    search: string;
    setSearch: (key: string) => void;
    getAllProductItems: (page: number) => Promise<void>;
    createProductItem: (product: any) => Promise<void>;
    updateProductItem: (id: number, product: any) => Promise<void>;
    deleteProductItem: (id: number) => Promise<void>;
    current: number;
    totalElements: number;

}

export const useProductItemStore = create<ProductItemState>((set, get) => ({
    productItems: [],
    search: "",
    current: 1,
    totalElements: 0,
    productId:0,
    setProductId: (key) => {
        set({ productId: key });
    },

    setSearch: (key: string) => {
        set({ search: key });
    },

    getAllProductItems: async (page: number) => {
        const apiCall = () => getAllProductItems(page, get().search,get().productId);
        const onSuccess = (response: any) => {
                set({
                    productItems: response.data.content,
                    current: page,
                    totalElements: response.data.totalElements,
                });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    createProductItem: async (productItem: any) => {
        const apiCall = () => createNewProductItem(productItem);
        const onSuccess = (response: any) =>{
            if(get().productItems.length<PAGE_SIZE){
                set({
                    productItems:[...get().productItems,response.data],
                })
                return;
            }
            get().getAllProductItems(get().current + 1);


        }
        return await handleApiRequest(apiCall, onSuccess);
    },

    updateProductItem: async (id: number, productItem: any) => {
        const apiCall = () => updateProductItemById(id, productItem);
        const onSuccess = (response: any) => {
            const updated = get().productItems.map((op: any) =>
                op.id === id ? response.data : op
            );

            set({
                productItems: updated
            });
        }
        return await handleApiRequest(apiCall, onSuccess);
    },

    deleteProductItem: async (id: number) => {
        const apiCall = () => deleteProductItemById(id);
        const onSuccess = (response: any) => {
            const updated = get().productItems.filter((op: any) => op.id !== id);

            if (get().productItems.length === 1 && get().current > 1) {
                get().getAllProductItems(get().current - 1);
                return;
            }
            set({
                productItems: updated,

            });
        }
        return await handleApiRequest(apiCall, onSuccess);
    },
}));
