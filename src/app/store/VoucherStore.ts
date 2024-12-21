
import {create} from "zustand";
import {handleApiRequest} from "@/app/util/utils";
import {createVoucher,getAllVouchers,updateVoucherById,deleteVoucherById,getAllVoucherValid,getMyVouchers,redeemVoucher} from "@/apis/modules/voucher";
import {PAGE_SIZE} from "@/app/util/constant";

interface VoucherState {
    vouchers: any[];
    validVouchers: any[];
    userVouchers: any[];
    search: string;
    setSearch: (key: string) => void;
    setUserVouchers : (vouchers:any)=> void;
    getAllVouchers: (page: number) => Promise<void>;
    getAllValidVoucher: (page:number) => Promise<void>;
    getMyVoucher: (page: number) => Promise<void>;
    redeemVoucher: (id:number) => Promise<void>;
    createVoucher: (voucher: any) => Promise<void>;
    updateVoucher: (id: number, voucher: any) => Promise<void>;
    deleteVoucher: (id: number) => Promise<void>;
    current: number;
    totalElements: number;
}

export const useVoucherStore=create<VoucherState>((set,get)=>({
    vouchers:[],
    validVouchers: [],
    userVouchers: [],
    search:"",
    current: 1,
    totalElements: 0,

    setSearch:(s)=>{
        set({search:s})
    },

    setUserVouchers:(vouchers)=>{
        set({userVouchers: vouchers})
    },

    getAllVouchers: async (page: number) => {
        const apiCall = () => getAllVouchers(page, get().search);
        const onSuccess = (response: any) => {
                set({
                    vouchers: response.data.content,
                    current: page,
                    totalElements: response.data.totalElements,
                });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    createVoucher: async (voucher:any) => {
        const apiCall = () => createVoucher(voucher);
        const onSuccess = (response: any) => {
            if(get().vouchers.length<PAGE_SIZE){
                set({
                    vouchers:[...get().vouchers,response.data],
                })
                return;
            }
            get().getAllVouchers(get().current + 1);
        };
        return await handleApiRequest(apiCall, onSuccess);
    },
    updateVoucher:async (id:number,voucher:any)=>{
        const apiCall = () => updateVoucherById(id, voucher);
        const onSuccess = (response: any) => {
            const updated = get().vouchers.map((op: any) =>
                op.id === id ? response.data : op
            );

            set({
                vouchers: updated
            });
        };
        return await handleApiRequest(apiCall, onSuccess);
    },
    deleteVoucher:async (id:number)=>{
        const apiCall = () => deleteVoucherById(id);
        const onSuccess = (response: any) => {
            const updated = get().vouchers.filter((op: any) => op.id !== id);

            if (get().vouchers.length === 1 && get().current > 1) {
                get().getAllVouchers(get().current - 1);
                return;
            }
            set({
                vouchers: updated,

            });
        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    /* Mới thêm */
    getAllValidVoucher:async (page:number) => {
        const apiCall = () => getAllVoucherValid(page);
        const onSuccess = (response: any) => {
            set({
                validVouchers: response.data.content,
                current: page,
                totalElements: response.data.totalElements,
            });
        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    getMyVoucher: async (page: number) => {
        const apiCall = () => getMyVouchers(page);
        const onSuccess = (response: any) => {
                set({
                    userVouchers: response.data.content,
                    current: page,
                    totalElements: response.data.totalElements,
                });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    redeemVoucher:async (id:number) => {
        const apiCall = () => redeemVoucher(id);
        const onSuccess = (response: any) => {
        
        };
    return await handleApiRequest(apiCall, onSuccess);
    }
    /* Mới thêm */
}))
