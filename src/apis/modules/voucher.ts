import api from "@/apis/request";
import {PAGE_SIZE} from "@/app/util/constant";


export function getAllVouchers(pageNum:any,search:string) {
    if(pageNum==0){
        return api.get(`vouchers`);
    }
    if(search.trim()!=""){
        return api.get(`vouchers?pageNum=${pageNum}&pageSize=${PAGE_SIZE}&search=${search.trim()}`);
    }else {
        return api.get(`vouchers?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);
    }
}

export function createVoucher(voucher:any){
    return api.post('vouchers/create',voucher)
}

export function updateVoucherById(id:number,voucher:any){
    return api.put(`vouchers/update/${id}`,voucher)
}

export function deleteVoucherById(id:number){
    return api.delete(`vouchers/delete/${id}`)
}

/* Mới thêm */
export function getAllVoucherValid(page:number){
    if(page == 0){
        return api.get('vouchers/valid')
    }
    return api.get(`vouchers/valid?pageNum=${page}&pageSize=${PAGE_SIZE}`)
}


export function getMyVouchers(pageNum: any) {
    if(pageNum == 0){
        return api.get(`vouchers/my-voucher`);
    }
    return api.get(`vouchers/my-voucher?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);
}

export function redeemVoucher(voucherId: number) {
    return api.post(`vouchers/redeem?voucherId=${voucherId}`)
}
/* Mới thêm */