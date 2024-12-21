import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
// import { deleteCookie, getCookie } from "cookies-next";
import Swal from "sweetalert2";
import { removeLocalStorage } from "@/app/util/localStorageUtils";

export const BASE_URL = "http://localhost:7000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // const token = getCookie("token");
    // if (token) {
    //   config.headers.Authorization = "Bearer " + token;
    // }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  //   (response) => {
  //     if (response.data.code === 0) {
  //       return response.data;
  //     }
  //     return {
  //       errorCode: response.data.code,
  //       errorMessage: response.data.message,
  //     };
  //   },
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    const showAlert = async () => {
      await Swal.fire({
        title: "Phiên đăng nhập hết hạn!",
        text: "",
        icon: "info",
        confirmButtonText: "OK",
      });

      window.location.replace("/auth");
    };

    // Lấy URL của request
    const requestUrl = error.config?.url;

    if (error.response?.status === 401) {
      showAlert().then((r) => null);
    }
    // check conditions to refresh token if needed
    return Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });
  }
);

export default api;
