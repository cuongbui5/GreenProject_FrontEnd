import {create} from "zustand";

import {handleApiRequest} from "@/app/util/utils";
import {registerRequest,logoutRequest, loginRequest} from "@/apis/modules/auth";
import {createContact, deleteContact, getAllContactsByUser} from "@/apis/modules/contact";
import {getAllAccountByUser, linkAccountPayment} from "@/apis/modules/payment_account";

interface PaymentAccountState{
    paymentAccounts:any[],
    getAllPaymentAccounts:()=>Promise<void>,
    linkAccount:(data:any)=>Promise<void>,


}

export const usePaymentAccountStore=create<PaymentAccountState>((set,get)=>({
    paymentAccounts:[],
    getAllPaymentAccounts:async ()=>{
        const apiCall=()=>getAllAccountByUser();
        return await handleApiRequest(apiCall,(res)=>{
            set({paymentAccounts:res.data})
        })

    },
    linkAccount: async (data:any)=>{
        const apiCall=()=>linkAccountPayment(data);
        return await handleApiRequest(apiCall,(res)=>{
            set({
                paymentAccounts:[...get().paymentAccounts,res.data]
            })
        })

    },

}))