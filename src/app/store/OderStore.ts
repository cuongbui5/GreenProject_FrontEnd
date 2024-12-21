import {create} from "zustand";
import {getOrderById, updateVoucherOrder} from "@/apis/modules/order";
import {handleApiRequest} from "@/app/util/utils";



interface OrderState{
    order:any,
    setOrder:(order:any)=>void,
    setContactToOrder:(contact:any)=>void
    setVoucherToOrder:(voucherId:any,orderId:number)=>Promise<void>
    getOrderById:(id:number)=>Promise<void>

}

export const useOrderStore=create<OrderState>((set,get)=>({

    order:null,

    setOrder:(order:any)=>{
        set({
            order:order
        })
    },
    setContactToOrder:(contact:any)=>{
        set({
            order:{
                ...get().order,
                contact
            }
        })
    },
    setVoucherToOrder:async (vId:number,orderId:number)=>{
        const apiCall=()=>updateVoucherOrder({orderId:orderId,voucherId:vId})
        return await handleApiRequest(apiCall,(response:any)=>{
            set({
                order:{...get().order,...response.data}
            })
        })
    },
    getOrderById:async (id:number)=>{
        const apiCall=()=>getOrderById(id)
        return await handleApiRequest(apiCall,(response:any)=>{
            set({
                order:response.data
            })
        })
    }


}))