import api from "@/apis/request";

export function createContact(data:any){
    return api.post("contacts/create",data)
}

export function getAllContactsByUser(){
    return api.get("contacts/getByUser")
}

export function deleteContact(id:number){
    return api.delete(`contacts/delete/${id}`)
}