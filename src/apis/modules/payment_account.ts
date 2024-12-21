import api from "@/apis/request";

export function getAllAccountByUser() {
    return api.get("payment_accounts/user");

}

export function linkAccountPayment(data:any) {
    return api.post("payment_accounts/link",data);

}