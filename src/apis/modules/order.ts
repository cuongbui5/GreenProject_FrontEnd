import api from "@/apis/request";
import {PAGE_SIZE} from "@/app/util/constant";

export function createOrderByNow(data:any){
    return api.post("orders/create",data)
}
export function createOrderByCart(){
    return api.post("orders/createByCart")
}

export function getOrderById(id:number){
    return api.get(`orders/${id}`)
}
export function deleteOrder(id:number){
    return api.delete(`orders/delete/${id}`)
}

export function updateContactOrder(data:any){
    return api.post(`orders/set-contact`,data)
}

export function updateVoucherOrder(data:any){
    return api.post(`orders/set-voucher`,data)
}
export function payment(data:any){
    return api.post(`orders/pay`,data)
}

export function getOrderByStatus(status:string){
    return api.get(`orders/user?status=${status}`)
}

export function updateOrderStatus(id:number,data:any){
    return api.put(`orders/update-status/${id}`,data)
}


export function getAllOrders(status:string,page:number){
    return api.get(`orders?status=${status}&pageNum=${page}&pageSize=${PAGE_SIZE}`)
}
