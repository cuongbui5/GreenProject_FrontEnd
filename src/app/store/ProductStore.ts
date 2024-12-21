import { create } from "zustand";
import {
    createNewProduct,
    deleteProductById,
    getAllProducts,
    getProductOnTopSold,
    updateProductById
} from "@/apis/modules/product";
import { ProductDto } from "@/app/admin/_components/products/ProductForm";
import {handleApiRequest} from "@/app/util/utils";

interface ProductState {
    products: any[];
    productItemOnTopSold: any[];
    getAllProducts: () => Promise<void>;
    createProduct: (product: ProductDto) => Promise<void>;
    updateProduct: (id: number, product: ProductDto) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProductOnTopSold: (pageNum:number, pageSize:number) => Promise<void>;


}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    productItemOnTopSold: [],

    getProductOnTopSold: async(pageNum:number, pageSize:number)=>{
        const apiCall = () => getProductOnTopSold(pageNum,pageSize);
        const onSuccess = (response: any) => {
                console.log(response)
                set({
                    productItemOnTopSold: response.data.content,
                });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    getAllProducts: async () => {
        const apiCall = () => getAllProducts();
        const onSuccess = (response: any) => {
                set({
                    products:response.data,
                })

        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    createProduct: async (product: ProductDto) => {
        const apiCall = () => createNewProduct(product);
        const onSuccess = (response: any) =>{
            set({
                products:[...get().products, response.data]

            })

        }
        return await handleApiRequest(apiCall, onSuccess);
    },

    updateProduct: async (id: number, product: ProductDto) => {
        const apiCall = () => updateProductById(id, product);
        const onSuccess = (response: any) => {
            const updated = get().products.map((p: any) =>
                p.id === id ? response.data : p
            );

            set({
                products: updated
            });
        }
        return await handleApiRequest(apiCall, onSuccess);
    },

    deleteProduct: async (id: number) => {
        const apiCall = () => deleteProductById(id);
        const onSuccess = (response: any) => {
            const updated = get().products.filter((p: any) => p.id !== id);
            set({
                products: updated
            });
        }
        return await handleApiRequest(apiCall, onSuccess);
    },
}));
