import {create} from "zustand";
import {addCart, deleteCart, getMyCart, updateCart} from "@/apis/modules/item";
import {handleApiRequest} from "@/app/util/utils";
import {message} from "antd";




interface CartState{
    cartItems:any[],
    addToCart:(data:any)=>Promise<void>,
    getAllCartItems:()=>Promise<void>,
    deleteCartItem:(id:number)=>Promise<void>,
    updateCartQuantity:(qty:number,id:number)=> Promise<void>,


}

export const useCartStore=create<CartState>((set,get)=>({
    cartItems:[],

    addToCart:async (data:any)=>{
        const apiCall=()=> addCart(data);
        return await handleApiRequest(apiCall,(response:any)=>{
            set({
                cartItems:[...get().cartItems,response.data]
            })
            message.success("đã thêm giỏ hàng!")
        })
    },

    getAllCartItems:async ()=>{
        const apiCall=()=>getMyCart();
        return await handleApiRequest(apiCall,(response)=>{
            set({
                cartItems:response.data
            });

        })
    },
    updateCartQuantity:async (qty:number,id:number)=>{
        const apiCall=()=>updateCart(qty,id);
        await handleApiRequest(apiCall,(response)=>{
            console.log(response)
            set((state) => ({
                cartItems: state.cartItems.map((item: any) =>
                    item.id === id ? { ...item, quantity: qty, totalPrice: response.data.totalPrice } : item
                ),
            }));

        })

    },
    deleteCartItem: async (id:number)=>{
        const apiCall=()=>deleteCart(id);
        await handleApiRequest(apiCall,(response)=>{
            set((state) => ({
                cartItems: state.cartItems.filter((item: any) => item.id !== id),
            }));

        })
    }




}))