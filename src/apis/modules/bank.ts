import api from "@/apis/request";

export function getAllBanks() {
    return api.get("banks");

}