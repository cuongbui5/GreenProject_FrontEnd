import {create} from "zustand";

import {handleApiRequest} from "@/app/util/utils";
import {registerRequest,logoutRequest, loginRequest} from "@/apis/modules/auth";
import {createContact, deleteContact, getAllContactsByUser} from "@/apis/modules/contact";

interface ContactState{
    contacts:any[],
    getAllContact:()=>Promise<void>,
    createContact:(data:any)=>Promise<void>,
    deleteContact:(id:number)=>Promise<void>,
    updateContact:(id:number,data:any)=>Promise<void>

}

export const useContactStore=create<ContactState>((set,get)=>({
   contacts:[],
    getAllContact:async ()=>{
        const apiCall=()=>getAllContactsByUser();
        return await handleApiRequest(apiCall,(res)=>{
            set({contacts:res.data})
        })

    },
    createContact: async (data:any)=>{
        const apiCall=()=>createContact(data);
        return await handleApiRequest(apiCall,(res)=>{
            set({
                contacts:[...get().contacts,res.data]
            })
        })

    },
    updateContact:async (id,data)=>{


    },
    deleteContact:async (id)=>{
        const apiCall=()=>deleteContact(id);
        return await handleApiRequest(apiCall,(res)=>{
            set({
                contacts: get().contacts.filter(contact => contact.id !== id),
            });
        })


    }
}))