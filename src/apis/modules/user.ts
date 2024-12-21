import api from "@/apis/request";
import {PAGE_SIZE} from "@/app/util/constant";

export function getUserInfo(){
    return api.get('users/user-info');
}

export function updateUser(userData:any){
    return api.put('users/update',userData);
}

export function changePassword(changePassword: any){
    return api.post('users/change-password',changePassword);
}

