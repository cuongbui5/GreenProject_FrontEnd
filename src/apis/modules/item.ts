import api from "@/apis/request";

export function addCart(item:any){
    return api.post("items/add-cart",item)

}

export function getMyCart(){
    return api.get("items/my-cart")

}
export function updateCart(quantity:number,itemId:number){
    return api.put(`items/update-cart/${itemId}`,{quantity:quantity})

}

export function deleteCart(itemId:number){
    return api.delete(`items/delete-cart/${itemId}`)
}