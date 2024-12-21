import api from "@/apis/request";
export function getDashBoard(){
    return api.get(`dashboard/statistics`);
}

export function getOrderDashBoard(quarter:number,year:number){
    return api.get(`dashboard/order?quarter=${quarter}&year=${year}`);
}

export function getRevenueDashBoard(quarter:number,year:number){
    return api.get(`dashboard/revenue?quarter=${quarter}&year=${year}`);
}

export function getUserDashBoard(quarter:number,year:number){
    return api.get(`dashboard/user?quarter=${quarter}&year=${year}`);
}

export function getTopUserDashBoard(quarter:number,year:number){
    return api.get(`dashboard/top-user?quarter=${quarter}&year=${year}`);
}

export function getProductDashBoard(quarter:number,year:number){
    return api.get(`dashboard/products?quarter=${quarter}&year=${year}`);
}