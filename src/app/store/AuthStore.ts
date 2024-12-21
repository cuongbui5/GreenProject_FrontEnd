import {create} from "zustand";

import {handleApiRequest} from "@/app/util/utils";
import {registerRequest,logoutRequest, loginRequest} from "@/apis/modules/auth";

interface AuthState{
    userId:number,
    pathname:string,
    loading:boolean,
    setPathname:(path:string)=>void,
    login:(data:any)=>Promise<void>,
    register:(data:any)=>Promise<void>,
    logout:()=>Promise<void>,
}

export const useAuthStore=create<AuthState>((set,get)=>({
    pathname:"/login",
    userId:0,
    loading:false,
    setPathname:(path:string)=>{
        set({
            pathname:path
        })
    },
    login:async(data:any)=>{
        const apiCall = () => loginRequest(data);
        const onSuccess = (response: any) => {
            const authorities: Array<string> = response.data.authorities;
            localStorage.setItem('userId', response.data.id.toString());
            if (authorities[0] == "ADMIN") {
                window.location.href = "/admin";
            } else if (authorities[0] == "USER") {
                window.location.href = "/home";
            }
        };
        return await handleApiRequest(apiCall, onSuccess);

    },
    register:async(data:any)=>{
        const apiCall = () => registerRequest(data);
        const onSuccess = (response: any) => {
            set({
                pathname:"/login"
            })

        };
        return  await handleApiRequest(apiCall, onSuccess);

    },
    logout:async()=>{
        const apiCall = () => logoutRequest();
        const onSuccess = (response: any) => {
            console.log(response)
            localStorage.removeItem('userId');
            window.location.href="/auth"

        };
        return await handleApiRequest(apiCall, onSuccess);

    }
}))